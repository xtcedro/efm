import express from "express";
import { createAppointment, getAppointments } from "../controllers/appointmentController.js";

const router = express.Router();

// ✅ Route to create a new appointment
router.post("/", createAppointment);

// ✅ Route to fetch all appointments
router.get("/", getAppointments);

export default router;