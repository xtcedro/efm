-- Schema for Efficient Movers LLC Appointment Database
-- Created: 2025-01-10
-- Last Updated: 2025-01-21
-- Schema Version: 1.3

-- Create the database
CREATE DATABASE IF NOT EXISTS movers_db;
USE movers_db;

-- Create the appointments table
CREATE TABLE IF NOT EXISTS appointments (
    id INT AUTO_INCREMENT PRIMARY KEY,         
    name VARCHAR(100) NOT NULL,                
    phone VARCHAR(15) NOT NULL,                -- Supports international numbers
    email VARCHAR(100) NOT NULL,               
    from_address VARCHAR(255) NOT NULL,        -- Pickup Location
    to_address VARCHAR(255) NOT NULL,          -- Destination Location
    service VARCHAR(255) NOT NULL,             
    message TEXT,                              
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Constraints
    UNIQUE KEY unique_appointment (email, service, created_at), -- Prevent duplicate submissions
    INDEX idx_email (email)  -- Optimize email searches
);

-- Create the chat history table for customer inquiries (optional)
CREATE TABLE IF NOT EXISTS chat_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,  -- Can be NULL for anonymous chats
    user_message TEXT NOT NULL,
    bot_reply TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Insert sample data
INSERT INTO appointments (name, phone, email, from_address, to_address, service, message)
VALUES
('John Doe', '1234567890', 'john.doe@example.com', '123 Main St, OKC', '456 Elm St, OKC', 'Residential Moving', 'Need assistance with furniture moving.'),
('Jane Smith', '0987654321', 'jane.smith@example.com', '789 Oak St, OKC', '321 Pine St, Tulsa', 'Long-Distance Moving', 'Moving to a new home in Tulsa. Need careful handling.');