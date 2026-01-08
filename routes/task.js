const express = require('express');
const router = express.Router();

const Task = require('../models/task');

router.get('/', async (req, res) => {
    const tasks = await Task.find({});

    res.json(tasks)
});

router.post('/', async (req, res) => {
    const { 
        title, 
        details, 
        start_date, 
        end_date,
        status
    } = req.body;

    try {
        const newTask = new Task({ title, details, start_date, end_date, status });
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: err.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updateData = req.body;

        const updatedTask = await Task.findByIdAndUpdate(id, updateData, {
            new: true,
            runValidators: true
        });

        if (!updatedTask) {
            return res.status(404).json({ message: "Not Found"})
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ error: "Unable to update the task", details: error.message })
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) {
            return res.status(404).json({ message: "Not Found" });
        }

        res.status(200).json({ message: "Task successfully deleted", deletedTask });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;