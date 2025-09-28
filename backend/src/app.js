const express = require('express');
const cors = require('cors');
const path = require('path');

// Routes
const apiRoutes = require('./routes/index');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// API routes
app.use('/api', apiRoutes);

// Serve frontend
app.use(express.static(path.join(process.cwd(), 'frontend', 'dist')));

// SPA catch-all
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(process.cwd(), 'frontend', 'dist', 'index.html'));
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

module.exports = app;
