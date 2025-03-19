import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import appointmentRoutes from "./routes/appointments.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Enable CORS for cross-origin requests

// Serve static files (frontend)
app.use(express.static("public"));

// Register API routes
app.use("/api/appointments", appointmentRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});