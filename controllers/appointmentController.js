import { db } from "../config/db.js";

// ✅ Create a new appointment
export const createAppointment = async (req, res) => {
    try {
        const { name, phone, email, from_address, to_address, service, message } = req.body;

        // Insert appointment into database
        const [result] = await db.execute(
            "INSERT INTO appointments (name, phone, email, from_address, to_address, service, message, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())",
            [name, phone, email, from_address, to_address, service, message]
        );

        res.status(201).json({ message: "Appointment booked successfully!", appointmentId: result.insertId });
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).json({ error: "Failed to book appointment" });
    }
};

// ✅ Fetch all appointments
export const getAppointments = async (req, res) => {
    try {
        const [appointments] = await db.execute("SELECT * FROM appointments ORDER BY created_at DESC");
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ error: "Failed to fetch appointments" });
    }
};