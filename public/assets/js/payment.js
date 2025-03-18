export function initializeStripe(publicKey, formSelector, amountSelector, buttonSelector, messageSelector) {
    const stripe = Stripe(publicKey);
    const elements = stripe.elements();

    // Create card input field
    const cardElement = elements.create("card");
    cardElement.mount(formSelector);

    // Create Google Pay & Apple Pay button
    const paymentRequest = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: {
            label: "Donation",
            amount: 1000, // Default placeholder amount (will be updated dynamically)
        },
        requestPayerName: true,
        requestPayerEmail: true,
    });

    const prButton = elements.create("paymentRequestButton", { paymentRequest });

    paymentRequest.canMakePayment().then((result) => {
        if (result) {
            prButton.mount("#payment-request-button");
        } else {
            document.getElementById("payment-request-button").style.display = "none";
        }
    });

    return { stripe, cardElement, paymentRequest, prButton, amountSelector, buttonSelector, messageSelector };
}

export async function handleDonation({ stripe, cardElement, paymentRequest, amountSelector, buttonSelector, messageSelector }) {
    const donationForm = document.getElementById(amountSelector);
    const donateButton = document.getElementById(buttonSelector);
    const paymentMessage = document.getElementById(messageSelector);

    donationForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const amount = parseFloat(donationForm.value) * 100; // Convert to cents

        if (isNaN(amount) || amount <= 0) {
            paymentMessage.textContent = "❌ Please enter a valid donation amount.";
            return;
        }

        donateButton.disabled = true;
        paymentMessage.textContent = "Processing payment...";

        try {
            const response = await fetch("/api/stripe/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount })
            });

            const { clientSecret } = await response.json();

            // Handle card payments
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement }
            });

            if (error) {
                paymentMessage.textContent = `❌ Payment failed: ${error.message}`;
                donateButton.disabled = false;
            } else if (paymentIntent.status === "succeeded") {
                paymentMessage.textContent = "✅ Thank you for your support!";
            }
        } catch (err) {
            paymentMessage.textContent = `❌ Error: ${err.message}`;
            donateButton.disabled = false;
        }
    });

    // Handle Google Pay, Apple Pay, and Cash App Pay
    paymentRequest.on("paymentmethod", async (event) => {
        try {
            const response = await fetch("/api/stripe/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount: parseFloat(donationForm.value) * 100 })
            });

            const { clientSecret } = await response.json();

            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: event.paymentMethod.id,
                payment_method_options: {
                    cashapp: {
                        preferred_networks: ["visa", "mastercard"]
                    }
                }
            });

            if (error) {
                event.complete("fail");
                paymentMessage.textContent = `❌ Payment failed: ${error.message}`;
            } else if (paymentIntent.status === "succeeded") {
                event.complete("success");
                paymentMessage.textContent = "✅ Thank you for your support!";
            }
        } catch (err) {
            event.complete("fail");
            paymentMessage.textContent = `❌ Error: ${err.message}`;
        }
    });
}