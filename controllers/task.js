const Task = require('../models/task');

exports.get = async (req, res) => {
    const user = req.user;
    const tasks = await Task.find({ created_by: user.id }).sort({ end_date: -1 });
    
    res.json(tasks);
};

exports.create = async (req, res) => {
    const { title, details, start_date, end_date, status } = req.body;
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
        res.status(400).json({ message: error.message });
    }
};

exports.update = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;

        const validateTask = await Task.findOne({ _id: taskId, created_by: userId });
        
        if (validateTask) {
            const updateResult = await Task.findOneAndUpdate(
                { _id: taskId },
                { $set: req.body },
                { new: true }
            );
            
            if (updateResult) {
                return res.status(200).json(updateResult);
            }
        }

        return res.status(404).send('Task not found');
    } catch (error) {
        res.status(400).send(error.message);
    }
};

exports.delete = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;

        const validateTask = await Task.findOne({ _id: taskId, created_by: userId });
        
        if (validateTask) {
            const deletedTask = await Task.findByIdAndDelete(taskId);

            if (deletedTask) {
                return res.status(200).json(validateTask);
            }
        }

        res.status(404).json({ message: 'Task not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};