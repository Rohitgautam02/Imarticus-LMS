require('dotenv').config();
var express = require('express');
var cors = require('cors');
var path = require('path');
var connectDB = require('./config/db');

// import routes
var authRoutes = require('./routes/auth');
var courseRoutes = require('./routes/courses');
var documentRoutes = require('./routes/documents');
var paymentRoutes = require('./routes/payment');

var app = express();
var PORT = process.env.PORT || 5000;

// connect to database
connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// api routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/payment', paymentRoutes);

// serve landing page (part 3) - located in root/part3-landing
app.use('/landing', express.static(path.join(__dirname, '..', '..', 'part3-landing')));

// serve frontend as static files (part 1) - located in root/part1-lms/frontend
app.use(express.static(path.join(__dirname, '..', 'frontend')));

// catch-all: send index.html for any non-api route
app.get('*', function(req, res) {
    // dont catch api routes
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: 'Route not found' });
    }
    
    // If it's a subpath of /landing that wasn't found by static middleware, 404
    if (req.path.startsWith('/landing')) {
        return res.status(404).json({ message: 'Landing page resource not found' });
    }

    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'));
});

app.listen(PORT, function() {
    console.log('----------------------------------------------------');
    console.log('✅ Server is officially running!');
    console.log(`🌍 PORT: ${PORT}`);
    console.log('----------------------------------------------------');
    console.log(`🚀 Landing Page (Part 3): http://localhost:${PORT}/landing/`);
    console.log(`🎓 LMS Dashboard (Part 1): http://localhost:${PORT}/`);
    console.log('----------------------------------------------------');
});
