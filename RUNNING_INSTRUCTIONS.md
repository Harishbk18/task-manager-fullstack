# 🚀 How to Run the Task Manager Project

## 📋 Project Overview
This is a full-stack Task Manager application with:
- **Backend**: Node.js + Express API
- **Frontend**: Static HTML/CSS/JavaScript
- **Database**: MongoDB (or in-memory for testing)

## 🎯 Quick Start (No MongoDB Required)

### Option 1: Run with In-Memory Database (Recommended for Testing)
```bash
# Start both backend and frontend with in-memory database
npm run start:simple
```

This will:
- Start backend on port 3000 (with in-memory data storage)
- Start frontend on port 3001
- No database setup required

### Option 2: Run with MongoDB (Full Features)

#### Step 1: Install MongoDB
**Windows:**
1. Download MongoDB Community Server from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Install with default settings
3. MongoDB will run as a Windows service

**Alternative - MongoDB Atlas (Cloud):**
1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create free account and cluster
3. Get connection string and update `backend/env.local`

#### Step 2: Start the Project
```bash
# Start both backend and frontend with MongoDB
npm start
```

## 🔧 Manual Startup

### Backend Only
```bash
# With MongoDB
cd backend
npm start

# With in-memory database
cd backend
node server-simple.js
```

### Frontend Only
```bash
cd frontend
npm start
```

## 🌐 Access Points

- **Backend API**: http://localhost:3000
- **Frontend**: http://localhost:3001
- **API Health Check**: http://localhost:3000/api/health

## 📱 Test the Application

1. Open http://localhost:3001 in your browser
2. Click "Test Connection" to verify backend connectivity
3. Use the default test credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Create, manage, and delete tasks

## 🐛 Troubleshooting

### Port Already in Use
If ports 3000 or 3001 are busy:
```bash
# Check what's using the ports
netstat -an | findstr :3000
netstat -an | findstr :3001

# Kill processes if needed
taskkill /PID <process_id> /F
```

### PowerShell Execution Policy
If you get execution policy errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### MongoDB Connection Issues
- Ensure MongoDB service is running
- Check if MongoDB is installed and accessible
- Verify connection string in `backend/env.local`

## 📁 Project Structure
```
harish/
├── backend/           # Node.js API server
│   ├── server.js      # Full server with MongoDB
│   ├── server-simple.js # Simple server (no MongoDB)
│   ├── routes/        # API endpoints
│   ├── models/        # Database models
│   └── middleware/    # Authentication & validation
├── frontend/          # Static HTML frontend
│   └── public/        # HTML, CSS, JavaScript files
└── package.json       # Project scripts
```

## 🎉 Success Indicators

When running successfully, you should see:
- Backend console: "🚀 Server is running on port 3000"
- Frontend console: "Server running at http://localhost:3001"
- Browser shows the Task Manager interface
- "Test Connection" button shows green status

## 🔄 Switching Between Modes

- **Testing Mode**: `npm run start:simple` (no database setup)
- **Production Mode**: `npm start` (requires MongoDB)

## 📞 Support

If you encounter issues:
1. Check the console output for error messages
2. Verify all dependencies are installed (`npm install`)
3. Ensure ports are not blocked by firewall
4. Check if Node.js version is compatible (v14+ recommended)
