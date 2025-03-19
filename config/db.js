import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// ✅ Create database connection pool
export const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "appointment_user",
    password: process.env.DB_PASSWORD || "Password123!",
    database: process.env.DB_NAME || "movers_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

console.log("✅ Connected to MySQL Database.");