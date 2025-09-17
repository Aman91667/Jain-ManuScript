// app.js - Configures the Express application with all its middleware and routes.

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import all route handlers
const authRoutes = require('./routes/authRoutes');
const manuscriptRoutes = require('./routes/manuscriptRoutes');
const userRoutes = require('./routes/userRoutes');
const helpRoutes = require('./routes/helpRoutes');
const adminRoutes = require('./routes/adminRoutes'); // ✅ NEW: Import admin routes

const app = express();

// --- Middleware ---
app.use(express.json());
app.use(cors());
// ✅ Corrected path to serve the uploads folder from the project root
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// --- API Route Definitions ---
app.use('/api/auth', authRoutes);
app.use('/api/auth', adminRoutes); // ✅ NEW: Use admin routes
app.use('/api/manuscripts', manuscriptRoutes);
app.use('/api/users', userRoutes);
app.use('/api/help', helpRoutes);

// --- Frontend Serving ---
// ✅ Corrected path to serve the frontend dist folder from the project root
app.use(express.static(path.join(process.cwd(), 'frontend', 'dist')));

// This is the catch-all route for your SPA. It must be the very last route.
app.get(/.*/, (req, res) => {
    // ✅ Corrected path to send the index.html file
    res.sendFile(path.join(process.cwd(), 'frontend', 'dist', 'index.html'));
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server!' });
});

module.exports = app;