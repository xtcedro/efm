import stripe from '../config/stripe.js';

/**
 * ✅ Create a Payment Intent (Handles client payment requests)
 */
export const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || isNaN(amount) || amount <= 0) {
            return res.status(400).json({ error: "Invalid amount" });
        }

        // ✅ Add multiple payment methods: Card, Cash App, Google Pay, Apple Pay
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "usd",
            payment_method_types: ['card', 'cashapp'], // ✅ Enable Cash App Pay
            automatic_payment_methods: {
                enabled: true, // ✅ Enables Apple Pay & Google Pay
            }
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Stripe Payment Error:", error);
        res.status(500).json({ error: error.message });
    }
};