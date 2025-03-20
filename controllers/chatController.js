import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatController = async (req, res) => {
    try {
        const { message } = req.body || {}; // Handle empty requests

        // System prompt: AI identity and behavior for Efficient Movers LLC
        const systemPrompt = `
        You are the AI assistant for Efficient Movers LLC, a professional moving service provider.
        Your role is to assist customers with booking, pricing, services, and company policies.

        **📦 Efficient Movers LLC - Moving Made Easy 🚛**

        💰 **Pricing Information:**
        - Moving costs are based on quotes, with a **minimum deposit of $280** for 2 hours.
        - Additional time and distance charges vary by location and service type.
        - Customers must request a personalized quote.

        ✅ **Available Moving Services:**
        - **🏡 Residential Moving** - Secure and efficient home relocations.
        - **🏢 Commercial Relocation** - Hassle-free office and business moves.
        - **📦 Packing & Unpacking** - Professional handling of all your belongings.
        - **🚛 Long-Distance Moving** - Smooth interstate moving solutions.
        - **📍 Local Moving** - Reliable moving services within Oklahoma City.

        🔄 **Rescheduling & Cancellations:**
        - Rescheduling is possible with at least **48 hours' notice** (subject to availability).
        - **No refunds** are provided once a booking is confirmed.

        📩 **Contact Information:**
        - 📧 Email: <a href="mailto:efficientmovers20@gmail.com" style="color: #FFD700; text-decoration: underline;">efficientmovers20@gmail.com</a>
        - 📞 Phone: <a href="tel:+14057623899" style="color: #FFD700; text-decoration: underline;">405-762-3899</a>
        - 📍 Based in Oklahoma City, Serving Statewide & Beyond.

        **How can I assist you today?** 😊
        `;

        // If no message is sent (first interaction), return a professional and structured introduction
        if (!message) {
            return res.json({
                reply: `
                <b>Welcome to Efficient Movers LLC! 🚛</b><br><br>
                I'm your AI assistant, here to help with <b>moving quotes, scheduling, and service inquiries.</b><br><br>

                💰 <b>Pricing:</b> A **minimum deposit of $280** is required for 2 hours. Request a quote for exact costs.<br>
                📦 <b>Services:</b> Residential, Commercial, Packing, and Long-Distance Moves.<br>
                📍 <b>Coverage:</b> Serving Oklahoma City and beyond.<br><br>

                📩 <b>Need a quote?</b> Contact us:<br>
                - 📧 Email: <a href="mailto:efficientmovers20@gmail.com" style="color: #FFD700; text-decoration: underline;">efficientmovers20@gmail.com</a><br>
                - 📞 Phone: <a href="tel:+14057623899" style="color: #FFD700; text-decoration: underline;">405-762-3899</a><br><br>

                <b>How can I assist you today? 😊</b>
                `
            });
        }

        // Process user messages
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const chat = await model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 1000, // Limits response length
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
