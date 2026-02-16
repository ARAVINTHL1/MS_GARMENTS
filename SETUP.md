# Setup Instructions for Textile Insight Hub

This guide will help you set up and run both the frontend and backend of the Textile Insight Hub application.

## Prerequisites

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **MongoDB** (v5 or higher) - [Download here](https://www.mongodb.com/try/download/community)

## Step 1: Setup Backend

### 1.1 Install MongoDB
- Download and install MongoDB Community Server
- MongoDB will typically start automatically as a service on Windows
- To verify MongoDB is running, open a terminal and run: `mongod --version`

### 1.2 Install Backend Dependencies
```bash
cd backend
npm install
```

### 1.3 Start the Backend Server
```bash
npm start
```

The backend server will start on `http://localhost:5000`

**Note:** The admin user with email `mohanms@gmail.com` and password `mohan@123` is automatically created when the server starts.

## Step 2: Setup Frontend

### 2.1 Install Frontend Dependencies
Open a new terminal window (keep the backend running) and navigate to the project root:

```bash
npm install
```

### 2.2 Start the Frontend Development Server
```bash
npm run dev
```

The frontend will start on `http://localhost:5173` (or another port if 5173 is busy)

## Step 3: Test the Application

### 3.1 Login as Admin
1. Open your browser and go to `http://localhost:5173`
2. Select "Admin" tab
3. Use the following credentials:
   - Email: `mohanms@gmail.com`
   - Password: `mohan@123`

### 3.2 Create a Buyer Account
1. Click on "Sign up as Buyer" link at the bottom
2. Fill in the registration form:
   - Name: Your name
   - Email: Your email
   - Password: Your password
   - Phone: (Optional)
   - Address: (Optional)
3. Click "Sign Up"

### 3.3 Login as Buyer
1. Use the email and password you just registered with
2. Select "Buyer" tab
3. Click "Sign In"

## Troubleshooting

### Backend Issues

**Problem: MongoDB connection error**
- Solution: Make sure MongoDB is running. On Windows, check Services for "MongoDB Server"

**Problem: Port 5000 already in use**
- Solution: Edit `backend/.env` and change the PORT to another number (e.g., 5001)

**Problem: Admin user not created**
- Solution: Check the backend console logs. If there's an error, try deleting the database and restarting:
  ```bash
  # In MongoDB shell
  use textile-insight-hub
  db.dropDatabase()
  ```

### Frontend Issues

**Problem: Cannot connect to backend**
- Solution: Verify the backend is running on `http://localhost:5000`
- Check the `.env` file in the frontend root and ensure `VITE_API_URL=http://localhost:5000/api`

**Problem: CORS errors**
- Solution: Make sure the backend CORS is properly configured (it should be by default)

## Project Structure

```
textile-insight-hub/
├── backend/               # Backend API
│   ├── config/           # Database configuration
│   ├── controllers/      # Business logic
│   ├── middleware/       # Authentication middleware
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── scripts/          # Utility scripts
│   ├── .env              # Environment variables
│   └── server.js         # Main server file
├── src/                  # Frontend source
│   ├── components/       # React components
│   ├── context/          # React context (Auth)
│   ├── pages/            # Page components
│   └── types/            # TypeScript types
└── .env                  # Frontend environment variables
```

## Default Credentials

### Admin
- Email: `mohanms@gmail.com`
- Password: `mohan@123`

### Buyer
- Create your own account through the signup form

## Features

- ✅ Admin login with fixed credentials
- ✅ Buyer registration and login
- ✅ JWT-based authentication
- ✅ MongoDB database with separate collections for admins and buyers
- ✅ Password hashing with bcrypt
- ✅ Protected routes
- ✅ User session management

## Next Steps

After successfully logging in, you can:
- **As Admin:** Manage products, view orders, and access business analytics
- **As Buyer:** Browse products, place orders, and chat with support

Enjoy using Textile Insight Hub! 🎉
