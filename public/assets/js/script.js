import { loadHeader, loadFooter } from './load-components.js';
import { setupNavigation } from './navigation.js';
import { submitAppointments } from './appointment-booker.js';
import { fetchAppointments } from './public-appointments.js';
import { initializeChatbot } from './chatbot.js';
import { initializeStripe, handlePayment } from './payment.js';

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 DOM fully loaded. Initializing modules...");

    // ✅ Layout & Navigation
    loadHeader();
    loadFooter();
    setupNavigation();

    // ✅ Appointments
    submitAppointments();
    fetchAppointments();

    // ✅ Chatbot
    initializeChatbot();

    // ✅ Stripe Payments (Card, Apple Pay, Google Pay, Cash App)
    const stripeConfig = initializeStripe(
        "pk_live_51QsBMaB2ZF7d2k3EpiLM1QRwI3s2RL2PJl57Ctkl0tAxouh6kcP9F580Iyo3eW6qVTGix5f6eQdXNHmMgOxyO2Td00KiYFudmT", // ⚠️ Consider moving this to a secure ENV var
        "#card-element",
        "payment-amount",
        "payment-button",
        "payment-message"
    );

    handlePayment(stripeConfig);
});