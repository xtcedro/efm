import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const chatController = async (req, res) => {
    try {
        const { message } = req.body || {}; // Handle empty requests

        // System prompt: AI identity and behavior for Efficient Movers LLC
        const systemPrompt = `
        You are the AI assistant for Efficient Movers LLC, helping customers with moving quotes, scheduling, pricing, and policies.

        **🚛 Efficient Movers LLC - Reliable Moving Services 📦**

        💰 **Pricing:**  
        - All moves require a **minimum deposit of $280** (2-hour service).  
        - Final cost depends on distance, time, and service type.  

        ✅ **Services:**  
        - **🏡 Residential & 🏢 Commercial Moves**  
        - **📦 Packing & Unpacking**  
        - **🚛 Long-Distance & 📍 Local Moves**  

        🔄 **Rescheduling & Refunds:**  
        - Rescheduling allowed with **48+ hours' notice** (subject to availability).  
        - **No refunds** after booking confirmation.  

        📩 **Contact Us:**  
        - 📧 Email: <a href="mailto:efficientmovers20@gmail.com" style="color: #FFD700; text-decoration: underline;">efficientmovers20@gmail.com</a>  
        - 📞 Phone: <a href="tel:+14057623899" style="color: #FFD700; text-decoration: underline;">405-762-3899</a>  

        **How can I assist you today? 😊**
        `;

        // Return a concise introduction if no message is provided
        if (!message) {
            return res.json({
                reply: `
                <b>Welcome to Efficient Movers LLC! 🚛</b><br><br>
                Need a quote or have questions? I can assist with **pricing, scheduling, and services**.<br><br>

                💰 **Starting at $280 (2-hour minimum)**  
                📦 **Residential | Commercial | Long-Distance Moves**  
                📍 **Serving Oklahoma City & Beyond**<br><br>

                📩 **Contact us:**  
                - 📧 <a href="mailto:efficientmovers20@gmail.com" style="color: #FFD700; text-decoration: underline;">efficientmovers20@gmail.com</a><br>
                - 📞 <a href="tel:+14057623899" style="color: #FFD700; text-decoration: underline;">405-762-3899</a><br><br>

                **How can I assist you today? 😊**
                `
            });
        }

        // Process user messages
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const chat = await model.startChat({
            history: [],
            generationConfig: {
                maxOutputTokens: 1000,
                temperature: 0.7,
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