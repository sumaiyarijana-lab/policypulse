# PolicyPulse Environment Setup Guide

To run PolicyPulse locally, you will need to configure environment variables for both the frontend (Next.js) and the backend (Node.js).

## Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- MongoDB (Local instance or MongoDB Atlas)

---

## 1. Backend Setup (`/server`)

Create a `.env` file in the root of the `server/` directory and add the following keys:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
# Replace with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/policypulse

# Security
# Generate a strong, random 256-bit string for this
JWT_SECRET=your_super_secret_jwt_key_change_in_production

# CORS Configuration
# The URL of your frontend application
CLIENT_URL=http://localhost:3000

# AI Service (Optional Integration)
AI_SERVICE_URL=http://localhost:8000
```

---

## 2. Frontend Setup (`/client`)

Create a `.env.local` file in the root of the `client/` directory and add the following keys:

```env
# API Connection
# Point this to your backend server URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Socket Connection
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

---

## 3. Running the Project

### Start the Backend
```bash
cd server
npm install
npm run dev
```
*The server should start on `http://localhost:5000`*

### Start the Frontend
```bash
cd client
npm install
npm run dev
```
*The client should start on `http://localhost:3000`*

## Troubleshooting
- **CORS Errors**: Ensure that `CLIENT_URL` in the backend `.env` matches the exact URL of your frontend, including `http://` or `https://` and no trailing slashes.
- **MongoDB Connection Error**: Verify your IP is whitelisted in MongoDB Atlas or your local MongoDB service is running.
- **Missing Env Vars**: The backend will deliberately crash on startup if `MONGODB_URI` or `JWT_SECRET` are not defined, thanks to the startup validation sequence.
