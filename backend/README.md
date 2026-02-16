# Textile Insight Hub - Backend

This is the backend API for the Textile Insight Hub application, built with Node.js, Express, and MongoDB.

## Features

- User authentication (Admin & Buyer)
- JWT token-based authentication
- MongoDB database with two collections (admins & buyers)
- Fixed admin credentials
- Buyer registration

## Prerequisites

Before running the backend, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v5 or higher)

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - The `.env` file is already created with default values
   - Update `MONGODB_URI` if your MongoDB is running on a different port or host
   - Change `JWT_SECRET` to a secure random string in production

## Running the Server

1. Make sure MongoDB is running on your system:
   - On Windows: MongoDB should start automatically if installed as a service
   - Or manually start it: `mongod`

2. Start the backend server:
```bash
npm start
```

Or for development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

## Admin Credentials

The admin user is automatically created when the server starts:

- **Email:** mohanms@gmail.com
- **Password:** mohan@123

## API Endpoints

### Authentication Routes

#### POST /api/auth/login
Login for both admin and buyer users.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "admin" // or "buyer"
}
```

**Response:**
```json
{
  "_id": "userId",
  "name": "User Name",
  "email": "user@example.com",
  "role": "admin",
  "token": "jwt_token_here"
}
```

#### POST /api/auth/signup
Register a new buyer user.

**Request Body:**
```json
{
  "name": "Buyer Name",
  "email": "buyer@example.com",
  "password": "password123",
  "phone": "1234567890", // optional
  "address": "User Address" // optional
}
```

**Response:**
```json
{
  "_id": "userId",
  "name": "Buyer Name",
  "email": "buyer@example.com",
  "role": "buyer",
  "token": "jwt_token_here"
}
```

#### GET /api/auth/profile
Get user profile (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "_id": "userId",
  "name": "User Name",
  "email": "user@example.com",
  "role": "buyer",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Health Check

#### GET /api/health
Check if the server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

## Database Collections

### Admins Collection
- Fixed admin account with email `mohanms@gmail.com`
- Password is hashed using bcrypt

### Buyers Collection
- Dynamic collection for buyer registrations
- All buyer information is stored here
- Passwords are hashed using bcrypt

## Security Features

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Protected routes with middleware
- CORS enabled for frontend access

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod --version`
- Check if the MongoDB service is started
- Verify the connection string in `.env`

### Port Already in Use
- Change the PORT in `.env` file if 5000 is already in use

### Admin Not Created
- Check the console logs when starting the server
- Manually check MongoDB: `use textile-insight-hub` then `db.admins.find()`

## Development

The project structure:

```
backend/
├── config/
│   └── db.js              # Database configuration
├── controllers/
│   └── authController.js  # Authentication logic
├── middleware/
│   └── authMiddleware.js  # JWT authentication middleware
├── models/
│   ├── Admin.js           # Admin model
│   └── Buyer.js           # Buyer model
├── routes/
│   └── authRoutes.js      # Authentication routes
├── scripts/
│   └── initAdmin.js       # Initialize admin user
├── .env                   # Environment variables
├── .gitignore
├── package.json
└── server.js              # Main server file
```
