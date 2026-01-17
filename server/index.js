/**
 * SkillSwap Server Entry Point
 * Handles routing, middleware, and database connection.
 */
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/posts', require('./routes/postRoutes'));
app.use('/interaction', require('./routes/interactionRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/cart', require('./routes/cartRoutes'));
app.use('/orders', require('./routes/orderRoutes'));
app.use('/follow', require('./routes/followRoutes'));
app.use('/profile', require('./routes/profileRoutes'));
app.use('/comments', require('./routes/commentRoutes'));

app.get('/', (req, res) => {
  res.send('SkillSwap API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
