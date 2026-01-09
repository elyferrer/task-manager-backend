require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

const app = express();

const PORT = process.env.PORT;
const CONN = process.env.MONGO_URI;

app.use(express.json());
app.use(cookieParser());
// app.use(cors());

app.use(cors({
    origin: 'http://localhost:5173', // Your frontend origin
    credentials: true, // This enables Access-Control-Allow-Credentials: true
    // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    // allowedHeaders: ['Origin', 'X-XSRF-TOKEN', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'] // Allowed headers
}));

app.use('/tasks', taskRoutes);
app.use('/user', userRoutes);

mongoose.connect(CONN)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log(err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});