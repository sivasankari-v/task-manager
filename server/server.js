const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
require('dotenv').config();

// DB connect pannuradhu
connectDB(); 

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/task')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server Running on ${PORT}`));
