import { loadHeader, loadFooter } from './load-components.js';
import { setupNavigation } from './navigation.js';
import { submitAppointments } from './appointment-booker.js';
import { fetchAppointments } from './public-appointments.js';
import { initializeStripe, handlePayment } from './payment.js';

document.addEventListener("DOMContentLoaded", () => {
    loadHeader();
    loadFooter();
    setupNavigation();
    submitAppointments();
    fetchAppointments();

    // ✅ Initialize Stripe Payment Flow
    const stripeConfig = initializeStripe(
        "pk_live_YOUR_STRIPE_PUBLIC_KEY_HERE", // Replace with your actual Stripe public key
        "#card-element",
        "payment-amount",
        "payment-button",
        "payment-message"
    );

    handlePayment(stripeConfig);
});