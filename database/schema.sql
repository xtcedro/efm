-- Schema for Appointment Database
-- Created: 2025-01-10
-- Last Updated: 2025-01-21
-- Schema Version: 1.3

-- Create the database
CREATE DATABASE IF NOT EXISTS appointment_db;
USE appointment_db;

-- Create the appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,         
    name VARCHAR(100) NOT NULL,                
    phone VARCHAR(15) NOT NULL,                -- Supports international numbers
    email VARCHAR(100) NOT NULL,               
    service VARCHAR(255) NOT NULL,             
    message TEXT,                              
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Constraints
    UNIQUE KEY unique_appointment (email, service, created_at), -- Prevent duplicate submissions
    INDEX idx_email (email)  -- Optimize email searches
);

-- Optional: Insert sample data
INSERT INTO appointments (name, phone, email, service, message)
VALUES
('John Doe', '1234567890', 'john.doe@example.com', 'AI & Web Dev Crash Course', 'Excited to learn AI!'),
('Jane Smith', '0987654321', 'jane.smith@example.com', 'AI & Web Dev Crash Course', 'Looking forward to automating my business.');