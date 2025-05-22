# Modern Railway Management System
A Node.js-based REST API for managing railway services, passenger reservations, and seat availability in real-time. Built with Express.js and MySQL, featuring secure authentication and race condition handling for concurrent bookings.

## System Requirements

- Node.js v16.x or higher
- MySQL 8.0+
- Any API testing tool (Postman, Insomnia, etc.)

## Quick Start Guide

### 1. Database Configuration

First, set up your MySQL database:

```sql
CREATE DATABASE railway_management;
USE railway_management;

CREATE TABLE passengers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('passenger', 'admin') DEFAULT 'passenger',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE rail_services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  rail_id VARCHAR(50) UNIQUE NOT NULL,
  origin VARCHAR(255) NOT NULL,
  terminus VARCHAR(255) NOT NULL,
  seat_capacity INT NOT NULL,
  seats_open INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reservations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  passenger_id INT NOT NULL,
  service_id INT NOT NULL,
  seat_count INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (passenger_id) REFERENCES passengers(id),
  FOREIGN KEY (service_id) REFERENCES rail_services(id)
);
```

### 2. Project Setup

```bash
# Clone repository
git clone <your-repo-url>
cd railway-management-system

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### 3. Environment Configuration

Create a `.env` file with these variables:

```
PORT=3000
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=railway_management
JWT_SECRET=generate_secure_string
ADMIN_KEY=generate_secure_string
```

### 4. Launch Application

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Documentation

### Passenger Operations

#### 1. Create Account

```http
POST /api/passenger/signup
Content-Type: application/json

{
  "name": "Ediga Hari",
  "email": "hari@gmail.com",
  "password": "password"
}
```

#### 2. Login

```http
POST /api/passenger/login
Content-Type: application/json

{
  "email": "hari@gmail.com",
  "password": "password"
}
```

#### 3. View Available Services

```http
GET /api/passenger/services/availability?origin=Mumbai&terminus=Delhi
```

#### 4. Make Reservation

```http
POST /api/passenger/reservations
Authorization: Bearer <token>
Content-Type: application/json

{
  "serviceId": 1,
  "seatCount": 2
}
```

#### 5. View Reservations

```http
GET /api/passenger/reservations
Authorization: Bearer <token>
```

### Administrative Operations

#### 1. Add Rail Service

```http
POST /api/admin/services
x-api-key: <admin_key>
Content-Type: application/json

{
  "railId": "EXP420",
  "origin": "Hyderabad",
  "terminus": "Bangalore",
  "capacity": 400
}
```

#### 2. Update Service Capacity

```http
PUT /api/admin/services/:serviceId/capacity
x-api-key: <admin_key>
Content-Type: application/json

{
  "capacity": 600,
  "seatsOpen": 580
}
```

## Security Features

- API Key authentication for admin routes
- JWT-based passenger authentication
- Password hashing using bcrypt
- Database transaction locks for concurrent bookings
- Input validation and sanitization

## Technical Implementation

- **Database:** MySQL with connection pooling
- **Authentication:** JWT tokens & API keys
- **Security:** bcrypt password hashing
- **Framework:** Express.js
- **Environment:** dotenv configuration
- **Development:** nodemon for auto-reload

## Key Features

- Real-time seat availability tracking
- Concurrent booking protection
- Role-based access control
- Secure passenger authentication
- Administrative service management
- Transaction-safe reservations

## Error Handling

The API implements comprehensive error handling:

- Input validation errors (400)
- Authentication failures (401)
- Authorization errors (403)
- Resource not found (404)
- Server errors (500)

## Development and Testing

```bash
# Run in development
npm run dev

# Run tests (if implemented)
npm test
```

## Package Dependencies

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mysql2": "^3.6.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.1",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.2",
    "supertest": "^6.3.3"
  }
}
```

## Best Practices

- Use connection pooling for database efficiency
- Implement proper transaction isolation
- Handle race conditions in bookings
- Validate all inputs
- Use prepared statements for SQL
- Implement proper error handling
- Log important operations


## License

MIT License - feel free to use and modify as needed.