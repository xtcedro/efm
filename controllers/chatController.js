export const chatController = async (req, res) => {
    try {
        const { message } = req.body || {};

        console.log("✅ Received message from frontend:", message);

        if (!message) {
            console.log("✅ Sending chatbot introduction...");
            return res.json({
                reply: `
                <b>Welcome to Efficient Movers LLC! 🚛</b><br><br>
                📞 <b>Call us:</b> <a href="tel:+14057623899">405-762-3899</a><br>
                📧 <b>Email:</b> <a href="mailto:efficientmovers20@gmail.com">efficientmovers20@gmail.com</a><br><br>
                <b>How may I assist you today? 😊</b>
                `
            });
        }

        // AI Chat Logic (if message is provided)
    } catch (error) {
        console.error("❌ Chatbot Error:", error);
        res.status(500).json({ error: "AI processing failed. Please try again later." });
    }
};