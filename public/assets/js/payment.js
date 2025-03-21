export function initializeStripe(publicKey, formSelector, amountSelector, buttonSelector, messageSelector) {
    const stripe = Stripe(publicKey);
    const elements = stripe.elements();

    // ✅ Create Card Element (Standard Card Payments)
    const cardElement = elements.create("card", {
        style: {
            base: {
                fontSize: "16px",
                color: "#32325d",
                "::placeholder": { color: "#aab7c4" },
            },
            invalid: { color: "#fa755a" },
        },
    });

    // ✅ Ensure Card Element Mounts Properly
    const cardContainer = document.querySelector(formSelector);
    if (!cardContainer) {
        console.error("❌ Card Element container not found:", formSelector);
    } else {
        cardElement.mount(formSelector);
        console.log("✅ Card Element successfully mounted.");
    }

    // ✅ Apple Pay, Google Pay, Cash App Pay Setup
    const paymentRequest = stripe.paymentRequest({
        country: "US",
        currency: "usd",
        total: { label: "Total Payment", amount: 0 }, // Default to $0, will update dynamically
        requestPayerName: true,
        requestPayerEmail: true,
        paymentMethodTypes: ["card", "apple_pay", "google_pay", "cashapp"],
    });

    const paymentRequestButton = elements.create("paymentRequestButton", { paymentRequest });

    // ✅ Check Payment Request Button Support
    paymentRequest.canMakePayment().then((result) => {
        if (result) {
            paymentRequestButton.mount("#payment-request-button");
            console.log("✅ Payment Request Button Mounted.");
        } else {
            console.warn("⚠️ Payment Request Button not supported on this device.");
            document.getElementById("payment-request-button").style.display = "none";
        }
    });

    return { stripe, cardElement, paymentRequest, amountSelector, buttonSelector, messageSelector };
}

// ✅ Handle Payment Processing
export async function handlePayment({ stripe, cardElement, paymentRequest, amountSelector, buttonSelector, messageSelector }) {
    const paymentForm = document.getElementById(amountSelector);
    const paymentButton = document.getElementById(buttonSelector);
    const paymentMessage = document.getElementById(messageSelector);

    if (!paymentForm || !paymentButton || !paymentMessage) {
        console.error("❌ Payment form elements not found. Aborting payment process.");
        return;
    }

    paymentForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const amount = parseFloat(paymentForm.value) * 100; // Convert to cents

        if (isNaN(amount) || amount <= 0) {
            paymentMessage.textContent = "❌ Please enter a valid payment amount.";
            return;
        }

        paymentButton.disabled = true;
        paymentMessage.textContent = "⏳ Processing payment...";

        try {
            // ✅ Create a Payment Intent
            const response = await fetch("/api/stripe/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });

            const { clientSecret } = await response.json();

            if (!clientSecret) {
                throw new Error("❌ Server did not return a valid payment intent.");
            }

            // ✅ Handle Payment Request Button Flow
            paymentRequest.on("paymentmethod", async (event) => {
                console.log("💳 Processing Payment Request Button Payment...");
                const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: event.paymentMethod.id,
                });

                if (error) {
                    paymentMessage.textContent = `❌ Payment failed: ${error.message}`;
                    event.complete("fail");
                    console.error("❌ Payment Request Error:", error);
                } else {
                    paymentMessage.textContent = "✅ Payment Successful!";
                    event.complete("success");
                    console.log("🎉 Payment Request Button Success!");
                }
            });

            // ✅ Handle Traditional Card Payment Flow
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (error) {
                paymentMessage.textContent = `❌ Payment failed: ${error.message}`;
                paymentButton.disabled = false;
                console.error("❌ Card Payment Error:", error);
            } else if (paymentIntent.status === "succeeded") {
                paymentMessage.textContent = "✅ Thank you for your payment!";
                console.log("🎉 Card Payment Successful!");
            }
        } catch (err) {
            console.error("❌ Payment Processing Error:", err);
            paymentMessage.textContent = `❌ Error: ${err.message}`;
            paymentButton.disabled = false;
        }
    });
}