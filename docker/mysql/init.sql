-- إنشاء جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- إنشاء جدول المنتجات
CREATE TABLE IF NOT EXISTS products (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

-- إدراج مستخدمين تجريبيين (كلمة المرور: password)
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin'),
('Regular User', 'user@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'user');

-- إدراج منتجات تجريبية
INSERT INTO products (name, description, image, price, status) VALUES
('Laptop', 'High performance laptop', 'https://via.placeholder.com/300', 999.99, 'active'),
('Mouse', 'Wireless mouse', 'https://via.placeholder.com/300', 29.99, 'active'),
('Keyboard', 'Mechanical keyboard', 'https://via.placeholder.com/300', 79.99, 'active'),
('Monitor', '27 inch monitor', 'https://via.placeholder.com/300', 299.99, 'active'),
('Headphones', 'Noise cancelling', 'https://via.placeholder.com/300', 199.99, 'inactive');
