-- Simple Database Schema for Student Registration System
-- This is a minimal version with just the essential tables

-- Create database (uncomment and modify as needed)
-- CREATE DATABASE student_db;
-- USE student_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS users;

-- Create the main users table
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    course VARCHAR(255),
    student_class VARCHAR(100),
    percentage DECIMAL(5,2),
    branch VARCHAR(255),
    mobile_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create basic indexes
CREATE INDEX idx_users_email ON users(email);

-- Insert sample data
INSERT INTO users (name, email, course, student_class, percentage, branch, mobile_number) VALUES
('John Doe', 'john.doe@example.com', 'Computer Science', 'Final Year', 85.50, 'Computer Engineering', '+1234567890'),
('Jane Smith', 'jane.smith@example.com', 'Electrical Engineering', 'Third Year', 78.25, 'Electrical Engineering', '+1234567891'),
('Mike Johnson', 'mike.johnson@example.com', 'Mechanical Engineering', 'Second Year', 82.75, 'Mechanical Engineering', '+1234567892'),
('Sarah Wilson', 'sarah.wilson@example.com', 'Computer Science', 'First Year', 90.00, 'Computer Engineering', '+1234567893'),
('David Brown', 'david.brown@example.com', 'Civil Engineering', 'Final Year', 76.80, 'Civil Engineering', '+1234567894');

-- Show table structure
DESCRIBE users;

-- Show sample data
SELECT * FROM users; 