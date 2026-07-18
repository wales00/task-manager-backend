const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require('./src/routes/auth');
const taskRoutes = require('./src/routes/tasks');

dotenv.config();

const app = express();

app.use(cors());

const connectDB = require('./src/config/db');
connectDB();

app.get('/api/test', (req, res) => {
    res.json({ message: "Server is running" });
});

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});