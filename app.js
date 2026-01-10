require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

const app = express();

const PORT = process.env.PORT;
const F_PORT = process.env.FRONT_END_PORT;
const CONN = process.env.MONGO_URI;

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: `http://localhost:${F_PORT}`,
    credentials: true,
}));

app.use('/tasks', taskRoutes);
app.use('/user', userRoutes);

mongoose.connect(CONN)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});