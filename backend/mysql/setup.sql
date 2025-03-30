-- Reset authentication requirements
SET GLOBAL validate_password.policy=LOW;
SET GLOBAL validate_password.length=4;

-- Create database
CREATE DATABASE IF NOT EXISTS sema_mama_db;

-- Reset root user permissions
DROP USER IF EXISTS 'root'@'localhost';
DROP USER IF EXISTS 'root'@'%';
CREATE USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Root123!';
CREATE USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'Root123!';

-- Grant privileges
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;

USE sema_mama_db;
