-- Reset root password
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '';
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY '';

-- Create database and grant privileges
CREATE DATABASE IF NOT EXISTS sema_mama_db;
GRANT ALL PRIVILEGES ON sema_mama_db.* TO 'root'@'localhost';
GRANT ALL PRIVILEGES ON sema_mama_db.* TO 'root'@'%';
FLUSH PRIVILEGES;
