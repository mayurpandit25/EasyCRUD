-- Database Schema for Student Registration System
-- This file contains the complete database setup for the application

-- Create database (uncomment and modify as needed for your database system)
-- CREATE DATABASE student_db;
-- USE student_db;

-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS users;

-- Create users table
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

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_course ON users(course);
CREATE INDEX idx_users_branch ON users(branch);

-- Insert sample data
INSERT INTO users (name, email, course, student_class, percentage, branch, mobile_number) VALUES
('John Doe', 'john.doe@example.com', 'Computer Science', 'Final Year', 85.50, 'Computer Engineering', '+1234567890'),
('Jane Smith', 'jane.smith@example.com', 'Electrical Engineering', 'Third Year', 78.25, 'Electrical Engineering', '+1234567891'),
('Mike Johnson', 'mike.johnson@example.com', 'Mechanical Engineering', 'Second Year', 82.75, 'Mechanical Engineering', '+1234567892'),
('Sarah Wilson', 'sarah.wilson@example.com', 'Computer Science', 'First Year', 90.00, 'Computer Engineering', '+1234567893'),
('David Brown', 'david.brown@example.com', 'Civil Engineering', 'Final Year', 76.80, 'Civil Engineering', '+1234567894'),
('Emily Davis', 'emily.davis@example.com', 'Information Technology', 'Third Year', 88.90, 'Computer Engineering', '+1234567895'),
('Robert Miller', 'robert.miller@example.com', 'Electronics Engineering', 'Second Year', 79.45, 'Electronics Engineering', '+1234567896'),
('Lisa Garcia', 'lisa.garcia@example.com', 'Computer Science', 'First Year', 92.30, 'Computer Engineering', '+1234567897'),
('James Rodriguez', 'james.rodriguez@example.com', 'Mechanical Engineering', 'Final Year', 81.20, 'Mechanical Engineering', '+1234567898'),
('Maria Martinez', 'maria.martinez@example.com', 'Electrical Engineering', 'Third Year', 87.60, 'Electrical Engineering', '+1234567899');

-- Create additional tables for enhanced functionality (optional)

-- Create courses table
CREATE TABLE courses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_name VARCHAR(255) NOT NULL UNIQUE,
    course_code VARCHAR(50) NOT NULL UNIQUE,
    duration_years INT DEFAULT 4,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create branches table
CREATE TABLE branches (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    branch_name VARCHAR(255) NOT NULL UNIQUE,
    branch_code VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample courses
INSERT INTO courses (course_name, course_code, duration_years, description) VALUES
('Computer Science', 'CS', 4, 'Bachelor of Technology in Computer Science'),
('Electrical Engineering', 'EE', 4, 'Bachelor of Technology in Electrical Engineering'),
('Mechanical Engineering', 'ME', 4, 'Bachelor of Technology in Mechanical Engineering'),
('Civil Engineering', 'CE', 4, 'Bachelor of Technology in Civil Engineering'),
('Information Technology', 'IT', 4, 'Bachelor of Technology in Information Technology'),
('Electronics Engineering', 'ECE', 4, 'Bachelor of Technology in Electronics Engineering');

-- Insert sample branches
INSERT INTO branches (branch_name, branch_code, description) VALUES
('Computer Engineering', 'CSE', 'Computer Science and Engineering'),
('Electrical Engineering', 'EEE', 'Electrical and Electronics Engineering'),
('Mechanical Engineering', 'MECH', 'Mechanical Engineering'),
('Civil Engineering', 'CIVIL', 'Civil Engineering'),
('Electronics Engineering', 'ECE', 'Electronics and Communication Engineering');

-- Create user_roles table for role-based access (optional)
CREATE TABLE user_roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default roles
INSERT INTO user_roles (role_name, description) VALUES
('STUDENT', 'Regular student user'),
('ADMIN', 'Administrator with full access'),
('FACULTY', 'Faculty member'),
('STAFF', 'Staff member');

-- Create user_role_mapping table (optional)
CREATE TABLE user_role_mapping (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES user_roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_role (user_id, role_id)
);

-- Assign default role to existing users
INSERT INTO user_role_mapping (user_id, role_id)
SELECT u.id, r.id 
FROM users u, user_roles r 
WHERE r.role_name = 'STUDENT';

-- Create audit log table for tracking changes (optional)
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id BIGINT NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSON,
    new_values JSON,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for audit logs
CREATE INDEX idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Show table structure
DESCRIBE users;
DESCRIBE courses;
DESCRIBE branches;
DESCRIBE user_roles;
DESCRIBE user_role_mapping;
DESCRIBE audit_logs;

-- Show sample data
SELECT 'Users Table:' as table_name;
SELECT * FROM users LIMIT 5;

SELECT 'Courses Table:' as table_name;
SELECT * FROM courses;

SELECT 'Branches Table:' as table_name;
SELECT * FROM branches;

SELECT 'User Roles Table:' as table_name;
SELECT * FROM user_roles; 