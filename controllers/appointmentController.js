import { db } from "../config/db.js";

// Submit an appointment
export const submitAppointment = async (req, res) => {
    try {
        const { name, phone, email, from_address, to_address, service, message } = req.body;

        // Insert appointment into the database (using `created_at` for timestamp)
        const [result] = await db.execute(
            "INSERT INTO appointments (name, phone, email, from_address, to_address, service, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
            [name, phone, email, from_address, to_address, service, message]
        );

        res.status(201).json({ message: "Appointment booked successfully!", appointmentId: result.insertId });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ error: "Failed to book the appointment" });
    }
};

// Fetch all appointments
export const fetchAppointments = async (req, res) => {
    try {
        // Retrieve appointments ordered by most recent
        const [appointments] = await db.execute("SELECT * FROM appointments ORDER BY created_at DESC");

        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Failed to retrieve appointments" });
    }
};