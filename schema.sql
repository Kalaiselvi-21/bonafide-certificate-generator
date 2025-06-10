CREATE DATABASE bonafide_db;

USE bonafide_db;

-- Table for students
CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for bonafide certificate requests
CREATE TABLE requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  purpose VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  pdf_path VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Table for admins
CREATE TABLE admins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) UNIQUE,
  password VARCHAR(255)
);
INSERT INTO students (name, email, password) VALUES ('Kalaiselvi G', 'kalai@gmail.com', '$2b$10$FzjTGWTWj78HZ7KEw6tXSutvuu8Tl0e0D08pI8i1QBed2Itr2FLRW');
select * from students;
SHOW GRANTS FOR 'root'@'localhost';
CREATE USER 'student'@'localhost' IDENTIFIED BY 'Password';
GRANT ALL PRIVILEGES ON bonafide_db.* TO 'student'@'localhost';
FLUSH PRIVILEGES;

SELECT * FROM requests;
INSERT INTO requests (student_id, status) VALUES (1, 'pending');
ALTER TABLE requests
ADD COLUMN number VARCHAR(50),
ADD COLUMN category VARCHAR(50),
ADD COLUMN category1 VARCHAR(100),
ADD COLUMN category2 VARCHAR(100),
ADD COLUMN para VARCHAR(255);



