import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { db } from "./config/db.js";
import appointmentRoutes from "./routes/appointments.js";
import chatRoutes from "./routes/chat.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// ✅ Debugging: Log API Route Registrations
console.log("✅ Registering API Routes...");
console.log("➡️ Appointments: /api/appointments");
console.log("➡️ Chatbot: /api/chat");

// ✅ Register API routes
app.use("/api/appointments", appointmentRoutes);
app.use("/api/chat", chatRoutes);

app.listen(port, () => console.log(`🚀 Server running on http://localhost:${port}`));