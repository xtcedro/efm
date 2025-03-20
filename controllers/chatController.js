import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatController = async (req, res) => {
    try {
        const { message } = req.body || {}; // Handle empty requests

        // System prompt: AI identity and behavior
        const systemPrompt = `
        You are the AI assistant for Efficient Movers LLC, a professional moving company serving Oklahoma City and beyond. 
        Stay professional, concise, and helpful. Provide clear and accurate responses related to moving services, scheduling, and company policies.

        📦 **Moving Services:**
        - 🏡 **Residential Moving:** Safe and efficient home relocations.
        - 🏢 **Commercial Relocation:** Smooth office and business moves.
        - 📦 **Packing & Unpacking Services:** Professional handling of belongings.
        - 🚛 **Long-Distance Moving:** Reliable service across states.
        - 📍 **Local Moving:** Fast and affordable within Oklahoma City.

        💰 **Pricing Policy:**
        - **We do not have fixed pricing.** 
        - All moves require a **minimum deposit of $280** (covers the first 2 hours).
        - Additional costs are based on distance, load size, and service needs.
        - Customers must request a **personalized quote**.

        ❌ **Refund Policy:**
        - **All sales are final.** Deposits are non-refundable.
        - Rescheduling is allowed with **at least 48 hours’ notice**, subject to availability.

        📞 **Contact Information:**
        - **Email:** <a href="mailto:efficientmovers20@gmail.com" style="color: #FFD700; text-decoration: underline;">
        efficientmovers20@gmail.com</a>
        - **Phone:** <a href="tel:+14057623899" style="color: #FFD700; text-decoration: underline;">
        405-762-3899</a>

        **Important:** Customers must book appointments through the appointment scheduler and will receive a confirmation after submitting a request.
        `;

        // If no message is sent (first interaction), return an introduction message
        if (!message) {
            return res.json({
                reply: `
                <b>Welcome to Efficient Movers LLC! 🚛</b><br><br>
                I’m your AI assistant, here to help with <b>moving services, scheduling, and company policies.</b><br><br>

                📦 <b>Our Services:</b> Residential & Commercial Moving, Packing, Long-Distance Relocation.<br>
                💰 <b>Pricing:</b> Minimum deposit of <b>$280</b> for 2 hours. Request a custom quote.<br>
                📅 <b>Book a Move:</b> <a href="https://www.efficientmoversllc.com/appointment-booker.html" target="_blank" style="color: #FFD700; text-decoration: underline;">
                Schedule Now</a>.<br><br>

                📩 <b>Contact Us:</b><br>
                ✉️ <a href="mailto:efficientmovers20@gmail.com" style="color: #FFD700; text-decoration: underline;">
                efficientmovers20@gmail.com</a><br>
                📞 <a href="tel:+14057623899" style="color: #FFD700; text-decoration: underline;">
                405-762-3899</a><br><br>

                <b>How may I assist you today? 😊</b>
                `
            });
        }

        // Process user messages
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
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