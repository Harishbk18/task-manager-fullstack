const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// @route   GET /api/health
// @desc    Check API health status
// @access  Public
router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        version: '1.0.0'
    });
});

// @route   GET /api/health/db
// @desc    Check database connectivity
// @access  Public
router.get('/db', async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        let dbStatus = 'unknown';

        switch (dbState) {
            case 0:
                dbStatus = 'disconnected';
                break;
            case 1:
                dbStatus = 'connected';
                break;
            case 2:
                dbStatus = 'connecting';
                break;
            case 3:
                dbStatus = 'disconnecting';
                break;
        }

        res.json({
            success: true,
            message: 'Database health check completed',
            timestamp: new Date().toISOString(),
            database: {
                status: dbStatus,
                readyState: dbState,
                name: mongoose.connection.name,
                host: mongoose.connection.host,
                port: mongoose.connection.port
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Database health check failed',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

// @route   GET /api/health/full
// @desc    Comprehensive health check
// @access  Public
router.get('/full', async (req, res) => {
    try {
        const dbState = mongoose.connection.readyState;
        const dbStatus = dbState === 1 ? 'healthy' : 'unhealthy';

        const healthData = {
            success: true,
            message: 'Full health check completed',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development',
            version: '1.0.0',
            system: {
                platform: process.platform,
                nodeVersion: process.version,
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage()
            },
            database: {
                status: dbStatus,
                readyState: dbState,
                name: mongoose.connection.name,
                host: mongoose.connection.host,
                port: mongoose.connection.port
            },
            services: {
                api: 'healthy',
                database: dbStatus,
                authentication: 'healthy'
            }
        };

        // Check if all services are healthy
        const allHealthy = Object.values(healthData.services).every(status => status === 'healthy');

        res.status(allHealthy ? 200 : 503).json(healthData);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Health check failed',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

module.exports = router; 