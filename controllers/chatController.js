import { GoogleGenerativeAI } from "@google/generative-ai";
import { db } from "../config/db.js"; // Database for storing chat history

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatController = async (req, res) => {
    try {
        const { message } = req.body || {}; // Handle empty requests

        // System prompt: AI identity and behavior
        const systemPrompt = `
        You are Efficient Movers LLC's AI Assistant, specializing in professional moving services. 
        Provide **concise, friendly, and professional** responses about our services, booking, and pricing.

        🚛 **Our Moving Services:**
        - 🏡 **Residential Moving** – Safe and efficient home relocation.
        - 🏢 **Commercial Moving** – Office & business relocation with minimal downtime.
        - 🚛 **Long-Distance Moving** – Reliable state-to-state moving services.
        - 📦 **Packing & Unpacking** – Professional packing to keep belongings secure.

        📌 **Pricing & Deposits:**
        - **All moves require a quote.** Pricing is based on the distance, load, and service needs.
        - **Minimum Deposit:** $280 for the first **2 hours** of service.
        - **Additional Time:** Additional hours are billed based on the move requirements.

        🔄 **No Refund Policy:** All bookings are final. Rescheduling may be available with **48-hour notice**.

        📞 **Contact Us:**
        - 📧 **Email:** <a href="mailto:efficientmovers20@gmail.com" style="color: #FFD700; text-decoration: underline;">efficientmovers20@gmail.com</a>
        - 📞 **Phone:** <a href="tel:+14057623899" style="color: #FFD700; text-decoration: underline;">(405) 762-3899</a>

        📅 **Get a Free Quote:**
        <a href="https://www.efficientmoversokc.com/appointment-booker.html" target="_blank" style="color: #FFD700; text-decoration: underline;">
        Request a Quote</a>
        `;

        // If no message is sent (first interaction), return a short, direct response
        if (!message) {
            return res.json({
                reply: `
                📞 <b>Efficient Movers LLC</b><br>
                📧 <a href="mailto:efficientmovers20@gmail.com" style="color: #FFD700; text-decoration: underline;">efficientmovers20@gmail.com</a><br>
                📍 Serving Oklahoma City & Beyond<br>
                💰 Minimum Deposit: $280 (2 hours)<br>
                📅 <a href="https://www.efficientmoversokc.com/appointment-booker.html" target="_blank" style="color: #FFD700; text-decoration: underline;">Request a Quote</a><br><br>
                <b>How may I assist you today?</b> 😊
                `
            });
        }

        // Process user messages
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const chat = await model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 300, // Limits response length
                temperature: 0.7, // Adjusts creativity level
            },
        });

        const response = await chat.sendMessage([systemPrompt, message]);
        const botReply = response.response.text();

        res.json({ reply: botReply });
    } catch (error) {
        console.error("AI Error:", error);
        res.status(500).json({ error: "AI processing failed. Please try again later." });
    }
};