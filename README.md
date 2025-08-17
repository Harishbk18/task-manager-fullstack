# Task Manager - Full-Stack Application

A complete Task Manager application with separated frontend and backend architecture, now running with an in-memory database for easy testing.

## 🏗️ Project Structure

```
task-manager-fullstack/
├── frontend/                 # Frontend application
│   ├── public/              # Static HTML/CSS/JS files
│   │   ├── index.html       # Main application interface
│   │   └── ...              # Other frontend assets
│   └── package.json         # Frontend dependencies
├── backend/                  # Backend API server
│   ├── server-simple.js     # Simple server (in-memory database)
│   ├── server.js            # Full server with MongoDB (optional)
│   ├── models/              # Database models
│   ├── routes/              # API route handlers
│   ├── middleware/          # Custom middleware
│   ├── package.json         # Backend dependencies
│   └── env.local            # Environment configuration
├── package.json             # Root package.json for managing both
├── RUNNING_INSTRUCTIONS.md  # Detailed running instructions
└── README.md                # This file
```

## 🚀 Quick Start

### 1. Install All Dependencies
```bash
npm run install:all
```

### 2. Start Both Frontend and Backend (Simple Mode - No Database Required)
```bash
npm run start:simple
```

This will start:
- **Backend**: http://localhost:3000 (API server with in-memory database)
- **Frontend**: http://localhost:3001 (Web interface)

### 3. Start with MongoDB (Full Features)
```bash
npm start
```

**Note**: This requires MongoDB to be installed and running.

### 4. Development Mode
```bash
npm run dev
```

This will start both services with auto-reload enabled.

## 🔧 Individual Service Management

### Backend Only
```bash
npm run start:backend    # Production mode (requires MongoDB)
npm run start:simple:backend # Simple mode (no database)
npm run dev:backend      # Development mode with nodemon
```

### Frontend Only
```bash
npm run start:frontend   # Production mode
npm run dev:frontend     # Development mode
```

## 🌐 Service URLs

- **Backend API**: http://localhost:3000
- **Frontend App**: http://localhost:3001
- **API Endpoints**: http://localhost:3000/api/*

## 📱 Frontend Features

- **Modern UI**: Beautiful, responsive design
- **Real-time Updates**: Instant task management
- **Authentication**: Login/signup system
- **Task Management**: Full CRUD operations
- **Connection Monitoring**: Real-time backend status

## 🔌 Backend Features

- **RESTful API**: Complete CRUD operations
- **Authentication**: JWT-based security
- **Two Modes**: 
  - Simple mode: In-memory database (no setup required)
  - Full mode: MongoDB with Mongoose
- **Validation**: Input sanitization and validation
- **Security**: Rate limiting, CORS, Helmet
- **Health Monitoring**: API health checks

## 🗄️ Database Options

### Option 1: Simple Mode (Recommended for Testing)
- **No setup required**
- **In-memory storage**
- **Data resets on server restart**
- **Perfect for development and testing**

### Option 2: MongoDB Mode (Production Ready)
1. **Install MongoDB** locally or use MongoDB Atlas
2. **Create environment file** in backend folder:
   ```bash
   cd backend
   cp env.example .env
   ```
3. **Update .env** with your MongoDB connection string

## 🧪 Testing

### Quick Test
1. Start the application with `npm run start:simple`
2. Open http://localhost:3001 in your browser
3. Use the default test credentials:
   - **Email**: `test@example.com`
   - **Password**: `password123`
4. Test all features: signup, login, task creation, management

### API Testing
- Use browser developer tools (F12) for debugging
- Check console logs for detailed information
- Test connection using the "Test Connection" button

## 🔍 Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Backend: Change PORT in backend/env.local
   - Frontend: Change port in frontend/package.json

2. **CORS Issues**
   - Backend CORS is configured to allow all origins in development
   - For production, restrict to your frontend domain

3. **Simple Mode vs MongoDB Mode**
   - Use `npm run start:simple` for testing (no database setup)
   - Use `npm start` for production (requires MongoDB)

4. **Frontend Not Loading**
   - Ensure backend is running first
   - Check browser console for errors
   - Verify API_BASE_URL is correct

## 📚 API Documentation

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/auth/me` - Get user profile

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks` - Get all tasks
- `PATCH /api/tasks/:id/toggle` - Toggle completion
- `DELETE /api/tasks/:id` - Delete task

### Health
- `GET /api/health` - Basic health check

## 🛠️ Development

### Adding New Features

1. **Backend**: Add routes in `backend/routes/`
2. **Frontend**: Update `frontend/public/index.html`
3. **Database**: Create models in `backend/models/` (for MongoDB mode)

### Code Style

- **Backend**: Node.js/Express.js conventions
- **Frontend**: Vanilla JavaScript with modern ES6+ features
- **Database**: Mongoose schemas with validation (MongoDB mode)

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions and support:
- Check the `RUNNING_INSTRUCTIONS.md` file
- Review browser console logs
- Test individual services separately
- Verify environment configuration

---

**Built with ❤️ for DevTown Bootcamp** 