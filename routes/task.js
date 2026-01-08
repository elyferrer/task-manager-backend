const express = require('express');
const router = express.Router();

const Task = require('../models/task');

const accessTokenUtil = require('../utils/accessToken');

router.get('/', accessTokenUtil.authenticateToken, async (req, res) => {
    const user = req.user;
    const tasks = await Task.find({ created_by: user.id });

    res.json(tasks)
});

router.post('/', accessTokenUtil.authenticateToken, async (req, res) => {
    const { 
        title, 
        details, 
        start_date, 
        end_date,
        status
    } = req.body;

    const { id } = req.user;

    try {
        const newTask = new Task({ 
            title, 
            details, 
            start_date, 
            end_date, 
            status, 
            created_by: id
        });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: err.message });
    }
});

router.patch('/:id', accessTokenUtil.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;

        const validateTask = await Task.findOne({ _id: taskId, created_by: userId });
        
        if (validateTask) {
            const updateResult = await Task.updateOne(
                { _id: taskId },
                { $set: req.body }
            );

            if (updateResult.modifiedCount === 0) {
                return res.status(404).send('No changes were made');
            }

            res.status(200).json({ message: 'Task updated successfully' });
        }

        return res.status(404).send('Task not found');
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.delete('/:id', accessTokenUtil.authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;

        const validateTask = await Task.findOne({ _id: taskId, created_by: userId });
        
        if (validateTask) {
            const deletedTask = await Task.findByIdAndDelete(taskId);

            if (!deletedTask) {
                return res.status(404).json({ message: "Not Found" });
            }

            res.status(200).json({ message: 'Task deleted successfully' });
        }

        res.status(404).json({ message: 'Task not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;