CREATE DATABASE IF NOT EXISTS boistockdb;
USE boistockdb;

CREATE TABLE products(
	id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT(0),
    created_At TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
   id int NOT NULL AUTO_INCREMENT,
   name varchar(100) NOT NULL,
   email varchar(100) NOT NULL,
   password varchar(200) NOT NULL,
   role enum('gerente','operador') DEFAULT 'operador',
   created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
   PRIMARY KEY (id),
   UNIQUE KEY email (email)
 );