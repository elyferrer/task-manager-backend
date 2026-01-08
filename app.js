require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

const app = express();

const PORT = process.env.PORT;
const CONN = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());
app.use('/tasks', taskRoutes);
app.use('/user', userRoutes);

// const tasks = [
//     { username: 'jollycasfer', title: 'Task 1' },
//     { username: 'Yuvin', title: 'Task 2' },
//     { username: 'Mau', title: 'Task 3' },
//     { username: 'jollycasfer', title: 'Task 4' },
//     { username: 'jollycasfer', title: 'Task 5' },
//     { username: 'jollycasfer', title: 'Task 6' },
//     { username: 'Yuvin', title: 'Task 7' },
//     { username: 'Mau', title: 'Task 8' }
// ];

// app.get('/tasks', accessTokenUtil.authenticateToken, (req, res) => {
//     res.send(tasks.filter(task => task.username === req.user.name ));
// });

mongoose.connect(CONN)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});