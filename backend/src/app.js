// app.js - Configures the Express application with all its middleware and routes.

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import all route handlers
const authRoutes = require('./routes/authRoutes');
const manuscriptRoutes = require('./routes/manuscriptRoutes');
const userRoutes = require('./routes/userRoutes');
const helpRoutes = require('./routes/helpRoutes');

const app = express();

// --- Middleware ---
// ✅ FIX: This middleware must be placed here to parse incoming JSON bodies.
app.use(express.json());

// Enables Cross-Origin Resource Sharing for the frontend.
app.use(cors());

// Serves static files from the 'uploads' directory.
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// --- Route Definitions ---
// Binds the imported routers to their base paths.
app.use('/api/auth', authRoutes);
app.use('/api/manuscripts', manuscriptRoutes);
app.use('/api/users', userRoutes);
app.use('/api/help', helpRoutes);

// --- Global Error Handler ---
// This is a catch-all for any unhandled errors in the application.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong on the server!' });
});

module.exports = app;