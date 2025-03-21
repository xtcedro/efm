import { loadHeader, loadFooter } from './load-components.js';
import { setupNavigation } from './navigation.js';
import { submitAppointments } from './appointment-booker.js';
import { fetchAppointments } from './public-appointments.js';
import { initializeChatbot } from './chatbot.js';

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
});