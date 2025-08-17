const express = require('express');
const { body, param } = require('express-validator');
const Task = require('../models/Task');
const auth = require('../middleware/auth');
const validate = require('../middleware/validation');

const router = express.Router();

// Apply auth middleware to all task routes
router.use(auth);

// Validation rules
const createTaskValidation = [
    body('title')
        .isLength({ min: 3, max: 200 })
        .withMessage('Task title must be between 3 and 200 characters')
        .trim(),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date')
];

const updateTaskValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid task ID'),
    body('title')
        .optional()
        .isLength({ min: 3, max: 200 })
        .withMessage('Task title must be between 3 and 200 characters')
        .trim(),
    body('description')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Description cannot exceed 500 characters'),
    body('priority')
        .optional()
        .isIn(['low', 'medium', 'high'])
        .withMessage('Priority must be low, medium, or high'),
    body('dueDate')
        .optional()
        .isISO8601()
        .withMessage('Due date must be a valid date'),
    body('completed')
        .optional()
        .isBoolean()
        .withMessage('Completed must be a boolean value')
];

const taskIdValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid task ID')
];

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', createTaskValidation, validate, async (req, res) => {
    try {
        const { title, description, priority, dueDate } = req.body;

        const task = new Task({
            title,
            description,
            priority,
            dueDate,
            user: req.user._id
        });

        await task.save();

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: { task }
        });
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating task',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/tasks
// @desc    Get all tasks for the logged-in user
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, completed, priority, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const query = { user: req.user._id };

        // Filter by completion status
        if (completed !== undefined) {
            query.completed = completed === 'true';
        }

        // Filter by priority
        if (priority && ['low', 'medium', 'high'].includes(priority)) {
            query.priority = priority;
        }

        // Sorting
        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const tasks = await Task.find(query)
            .sort(sortOptions)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('user', 'name email');

        const total = await Task.countDocuments(query);

        res.json({
            success: true,
            data: {
                tasks,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(total / limit),
                    totalTasks: total,
                    hasNextPage: page * limit < total,
                    hasPrevPage: page > 1
                }
            }
        });
    } catch (error) {
        console.error('Get tasks error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tasks',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   GET /api/tasks/:id
// @desc    Get a specific task by ID
// @access  Private
router.get('/:id', taskIdValidation, validate, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate('user', 'name email');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            data: { task }
        });
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching task',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', updateTaskValidation, validate, async (req, res) => {
    try {
        const { title, description, priority, dueDate, completed } = req.body;

        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        // Update only provided fields
        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (priority !== undefined) task.priority = priority;
        if (dueDate !== undefined) task.dueDate = dueDate;
        if (completed !== undefined) task.completed = completed;

        await task.save();

        res.json({
            success: true,
            message: 'Task updated successfully',
            data: { task }
        });
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating task',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', taskIdValidation, validate, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        res.json({
            success: true,
            message: 'Task deleted successfully',
            data: { task }
        });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting task',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

// @route   PATCH /api/tasks/:id/toggle
// @desc    Toggle task completion status
// @access  Private
router.patch('/:id/toggle', taskIdValidation, validate, async (req, res) => {
    try {
        const task = await Task.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found'
            });
        }

        task.completed = !task.completed;
        await task.save();

        res.json({
            success: true,
            message: `Task ${task.completed ? 'completed' : 'marked as pending'}`,
            data: { task }
        });
    } catch (error) {
        console.error('Toggle task error:', error);
        res.status(500).json({
            success: false,
            message: 'Error toggling task status',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
});

module.exports = router; 