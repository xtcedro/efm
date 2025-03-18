export function initializeStripe(publicKey, formSelector, amountSelector, buttonSelector, messageSelector) {
    const stripe = Stripe(publicKey);
    const elements = stripe.elements();

    // Create a Payment Request Button for Apple Pay, Google Pay, and Cash App
    const paymentRequest = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
            label: 'Total Payment',
            amount: 0, // Default to $0, will update dynamically
        },
        requestPayerName: true,
        requestPayerEmail: true,
        paymentMethodTypes: ['card', 'apple_pay', 'google_pay', 'cashapp'],
    });

    const paymentRequestButton = elements.create('paymentRequestButton', {
        paymentRequest,
    });

    // Check if the Payment Request Button is supported
    paymentRequest.canMakePayment().then((result) => {
        if (result) {
            paymentRequestButton.mount('#payment-request-button');
        } else {
            document.getElementById('payment-request-button').style.display = 'none';
        }
    });

    // Create a traditional Card Element
    const cardElement = elements.create("card");
    cardElement.mount(formSelector);

    return { stripe, cardElement, paymentRequest, amountSelector, buttonSelector, messageSelector };
}

export async function handlePayment({ stripe, cardElement, paymentRequest, amountSelector, buttonSelector, messageSelector }) {
    const paymentForm = document.getElementById(amountSelector);
    const paymentButton = document.getElementById(buttonSelector);
    const paymentMessage = document.getElementById(messageSelector);

    paymentForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        const amount = parseFloat(paymentForm.value) * 100; // Convert to cents

        if (isNaN(amount) || amount <= 0) {
            paymentMessage.textContent = "❌ Please enter a valid payment amount.";
            return;
        }

        paymentButton.disabled = true;
        paymentMessage.textContent = "Processing payment...";

        try {
            const response = await fetch("/api/stripe/create-payment-intent", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount }),
            });

            const { clientSecret } = await response.json();

            // Handle Payment Request Button Flow
            paymentRequest.on('paymentmethod', async (event) => {
                const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: event.paymentMethod.id,
                });

                if (error) {
                    paymentMessage.textContent = `❌ Payment failed: ${error.message}`;
                    event.complete('fail');
                } else {
                    paymentMessage.textContent = "✅ Payment Successful!";
                    event.complete('success');
                }
            });

            // Handle Traditional Card Payment Flow
            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: { card: cardElement },
            });

            if (error) {
                paymentMessage.textContent = `❌ Payment failed: ${error.message}`;
                paymentButton.disabled = false;
            } else if (paymentIntent.status === "succeeded") {
                paymentMessage.textContent = "✅ Thank you for your payment!";
            }
        } catch (err) {
            paymentMessage.textContent = `❌ Error: ${err.message}`;
            paymentButton.disabled = false;
        }
    });
}