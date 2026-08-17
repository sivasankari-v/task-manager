const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');

// Middleware to get user from token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ msg: 'No token' });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token not valid' });
    }
}

// POST /api/tasks - Add Task
router.post('/', auth, async (req, res) => {
    const { title, description } = req.body;
    try {
        const newTask = new Task({ title, description, user: req.user.id });
        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// GET /api/tasks - Get all tasks for logged in user
router.get('/', auth, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.user.id });
        res.json(tasks);
    } catch (err) {
        res.status(500).send('Server Error');
    }
}); // <<<< ITHU DHAN MISS AAGIDUCHU. IDHA ADD PANNITEN

// DELETE /api/tasks/:id - Delete Task
router.delete('/:id', auth, async (req, res) => { 
    try {
        await Task.findByIdAndDelete(req.params.id); 
        res.json({msg: 'Deleted'}) 
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// PUT /api/tasks/:id - Complete Task
router.put('/:id', auth, async (req, res) => { 
    try {
        const task = await Task.findById(req.params.id);
        task.completed = !task.completed; 
        await task.save(); 
        res.json(task) 
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;