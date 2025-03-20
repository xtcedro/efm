import { loadHeader, loadFooter } from './load-components.js';
import { setupNavigation } from './navigation.js';
import { submitAppointments } from './appointment-booker.js';
import { fetchAppointments } from './public-appointments.js';
import { initializeChatbot } from './chatbot.js'; // ✅ Import chatbot module

document.addEventListener("DOMContentLoaded", () => {
    loadHeader();
    loadFooter();
    setupNavigation();
    submitAppointments();
    fetchAppointments();
    initializeChatbot(); // ✅ Initialize chatbot functionality
});