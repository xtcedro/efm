import { loadHeader, loadFooter } from './load-components.js';
import { setupNavigation } from './navigation.js';
import { submitAppointments } from './appointment-booker.js';
import { fetchAppointments } from './public-appointments.js';
import { initializeChatbot } from './chatbot.js';
import { initializeStripe, handlePayment } from './payment.js'; // ✅ Import Stripe module

document.addEventListener("DOMContentLoaded", () => {
    loadHeader();
    loadFooter();
    setupNavigation();
    submitAppointments();
    fetchAppointments();
    initializeChatbot();

    // ✅ Initialize Stripe Payment Flow with Apple Pay, Google Pay, and Cash App
    const stripeConfig = initializeStripe(
        "pk_live_51QsBMaB2ZF7d2k3EpiLM1QRwI3s2RL2PJl57Ctkl0tAxouh6kcP9F580Iyo3eW6qVTGix5f6eQdXNHmMgOxyO2Td00KiYFudmT", // ✅ Securely replace with your actual Stripe publishable key
        "#card-element",
        "payment-amount",
        "payment-button",
        "payment-message"
    );

    handlePayment(stripeConfig);
});