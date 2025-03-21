// Efficient Movers LLC Payment Integration (Stripe.js)

const stripe = Stripe("pk_live_51QsBMaB2ZF7d2k3EpiLM1QRwI3s2RL2PJl57Ctkl0tAxouh6kcP9F580Iyo3eW6qVTGix5f6eQdXNHmMgOxyO2Td00KiYFudmT");
const elements = stripe.elements();
const cardElement = elements.create("card");

// Mount Card Element
cardElement.mount("#card-element");

// Select DOM Elements
const paymentForm = document.getElementById("payment-form");
const amountInput = document.getElementById("payment-amount");
const payButton = document.getElementById("payment-button");
const messageBox = document.getElementById("payment-message");

// Handle Payment Submission
paymentForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const amount = parseFloat(amountInput.value) * 100; // cents

    if (isNaN(amount) || amount <= 0) {
        messageBox.textContent = "❌ Please enter a valid payment amount.";
        return;
    }

    payButton.disabled = true;
    messageBox.textContent = "Processing payment...";

    try {
        const res = await fetch("/api/stripe/create-payment-intent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount })
        });

        const { clientSecret } = await res.json();

        const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: cardElement }
        });

        if (error) {
            messageBox.textContent = `❌ Payment failed: ${error.message}`;
            payButton.disabled = false;
        } else if (paymentIntent.status === "succeeded") {
            messageBox.textContent = "✅ Thank you for your payment!";
        }
    } catch (err) {
        messageBox.textContent = `❌ Error: ${err.message}`;
        payButton.disabled = false;
    }
});