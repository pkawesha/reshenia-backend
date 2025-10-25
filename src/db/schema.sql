-- Reshenia DB schema (minimal)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS groups (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(50) DEFAULT 'WhatsApp',
  is_active TINYINT(1) DEFAULT 0,
  members INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS listings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  price_zmw DECIMAL(12,2),
  contact_phone VARCHAR(50),
  contact_owner VARCHAR(255),
  contact_locked TINYINT(1) DEFAULT 1,
  created_by INT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  channel VARCHAR(50) NOT NULL,      -- MTN, Airtel, Zamtel, Zanaco
  reference VARCHAR(100) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  purpose VARCHAR(50) NOT NULL,      -- 'group_activation' | 'view_unlock'
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS commissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  listing_id INT NULL,
  group_id INT NULL,
  percent DECIMAL(5,2) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
