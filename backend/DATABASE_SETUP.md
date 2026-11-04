# Database Setup Guide

This guide explains how to set up the database for the Student Registration System.

## Database Schema Overview

The schema includes the following tables:

### Core Tables
- **users** - Main table for student information
- **courses** - Available courses/programs
- **branches** - Different engineering branches
- **user_roles** - Role definitions (STUDENT, ADMIN, FACULTY, STAFF)
- **user_role_mapping** - Many-to-many relationship between users and roles
- **audit_logs** - Track changes to data for audit purposes

## Setup Instructions

### 1. Choose Your Database System

The schema is compatible with:
- **MySQL** (5.7+)
- **MariaDB** (10.2+)
- **PostgreSQL** (with minor modifications)

### 2. Create Database

#### For MySQL/MariaDB:
```sql
CREATE DATABASE student_db;
USE student_db;
```

#### For PostgreSQL:
```sql
CREATE DATABASE student_db;
\c student_db;
```

### 3. Import Schema

#### Option A: Using Command Line
```bash
# MySQL
mysql -u your_username -p student_db < database_schema.sql

# MariaDB
mariadb -u your_username -p student_db < database_schema.sql

# PostgreSQL
psql -U your_username -d student_db -f database_schema.sql
```

#### Option B: Using Database GUI Tools
- **MySQL Workbench**: File → Open SQL Script → Select `database_schema.sql`
- **phpMyAdmin**: Import → Choose File → Select `database_schema.sql`
- **pgAdmin**: Tools → Query Tool → Load file → Select `database_schema.sql`

### 4. Verify Setup

After importing, you should see:
- 6 tables created
- 10 sample users inserted
- 6 courses inserted
- 5 branches inserted
- 4 user roles inserted
- Sample data relationships established

## Database Configuration

### For Spring Boot Application

When you're ready to add database support back to your Spring Boot application, update your `application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/student_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
spring.jpa.properties.hibernate.format_sql=true

# Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=300000
```

### For PostgreSQL:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/student_db
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

## Table Structure Details

### Users Table
```sql
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
```

### Key Features:
- **Auto-incrementing ID**: Primary key
- **Email uniqueness**: Prevents duplicate registrations
- **Audit fields**: `created_at` and `updated_at` timestamps
- **Indexes**: Optimized for email, course, and branch queries

## Sample Data

The schema includes 10 sample students with realistic data:
- Various engineering courses (CS, EE, ME, CE, IT, ECE)
- Different academic years (First Year to Final Year)
- Realistic percentage scores (76-92%)
- Different branches and mobile numbers

## Security Considerations

### 1. User Authentication
- Implement password hashing (BCrypt recommended)
- Add password field to users table
- Use Spring Security for authentication

### 2. Role-Based Access Control
- Use the `user_roles` and `user_role_mapping` tables
- Implement @PreAuthorize annotations in controllers
- Create different access levels for students, faculty, and admins

### 3. Data Validation
- Add constraints for email format
- Validate percentage range (0-100)
- Ensure mobile number format

## Backup and Maintenance

### Create Backup
```bash
# MySQL
mysqldump -u username -p student_db > backup_$(date +%Y%m%d_%H%M%S).sql

# PostgreSQL
pg_dump -U username student_db > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Backup
```bash
# MySQL
mysql -u username -p student_db < backup_file.sql

# PostgreSQL
psql -U username -d student_db < backup_file.sql
```

## Troubleshooting

### Common Issues:

1. **Connection Refused**
   - Check if database service is running
   - Verify port numbers (MySQL: 3306, PostgreSQL: 5432)

2. **Access Denied**
   - Verify username and password
   - Check user permissions on database

3. **Table Already Exists**
   - The schema includes `DROP TABLE IF EXISTS` statements
   - This will safely remove existing tables

4. **Character Encoding Issues**
   - Ensure database uses UTF-8 encoding
   - Add `?useUnicode=true&characterEncoding=UTF-8` to JDBC URL

## Next Steps

1. **Import the schema** using the instructions above
2. **Test the database** with sample queries
3. **Update your Spring Boot application** to use database instead of in-memory storage
4. **Add authentication and authorization** using Spring Security
5. **Implement data validation** and error handling
6. **Set up regular backups** for production use

## Support

If you encounter any issues:
1. Check the database logs for error messages
2. Verify your database version compatibility
3. Ensure all required permissions are granted
4. Test with a simple connection first 