const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// In-memory data storage for testing
let users = [];
let tasks = [];
let nextUserId = 1;
let nextTaskId = 1;

// Simple authentication middleware
const simpleAuth = (req, res, next) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    
    const user = users.find(u => u.token === token);
    if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    
    req.user = user;
    next();
};

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'API is healthy',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        database: 'In-memory (testing mode)'
    });
});

// Authentication routes
app.post('/api/auth/signup', (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and name are required'
            });
        }
        
        if (users.find(u => u.email === email)) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }
        
        const user = {
            id: nextUserId++,
            email,
            password, // In production, this should be hashed
            name,
            token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date()
        };
        
        users.push(user);
        
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
                token: user.token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating user'
        });
    }
});

app.post('/api/auth/login', (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }
        
        res.json({
            success: true,
            message: 'Login successful',
            data: {
                user: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
                token: user.token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error during login'
        });
    }
});

app.get('/api/auth/me', simpleAuth, (req, res) => {
    res.json({
        success: true,
        data: {
            user: { id: req.user.id, email: req.user.email, name: req.user.name, createdAt: req.user.createdAt }
        }
    });
});

// Task routes
app.get('/api/tasks', simpleAuth, (req, res) => {
    const userTasks = tasks.filter(t => t.userId === req.user.id);
    res.json({
        success: true,
        data: { tasks: userTasks }
    });
});

app.post('/api/tasks', simpleAuth, (req, res) => {
    try {
        const { title, priority = 'medium' } = req.body;
        
        if (!title || title.length < 3) {
            return res.status(400).json({
                success: false,
                message: 'Task title must be at least 3 characters long'
            });
        }
        
        const task = {
            id: nextTaskId++,
            title,
            priority,
            completed: false,
            userId: req.user.id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        tasks.push(task);
        
        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: { task }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating task'
        });
    }
});

app.patch('/api/tasks/:id/toggle', simpleAuth, (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const task = tasks.find(t => t.id === taskId && t.userId === req.user.id);
        
        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        
        task.completed = !task.completed;
        task.updatedAt = new Date();
        
        res.json({
            success: true,
            message: 'Task status updated',
            data: { task }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating task'
        });
    }
});

app.delete('/api/tasks/:id', simpleAuth, (req, res) => {
    try {
        const taskId = parseInt(req.params.id);
        const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.user.id);
        
        if (taskIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }
        
        tasks.splice(taskIndex, 1);
        
        res.json({
            success: true,
            message: 'Task deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting task'
        });
    }
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Task Manager Backend API is running! (Testing Mode)',
        version: '1.0.0',
        mode: 'In-memory database for testing',
        endpoints: {
            auth: '/api/auth',
            tasks: '/api/tasks',
            health: '/api/health'
        },
        frontend: 'http://localhost:3001'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Something went wrong!'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📚 API Documentation: http://localhost:${PORT}`);
    console.log(`🔗 Frontend: http://localhost:3001`);
    console.log(`⚠️  Running in TESTING MODE with in-memory database`);
    console.log(`💡 To use MongoDB, install MongoDB and use server.js instead`);
});

module.exports = app;
