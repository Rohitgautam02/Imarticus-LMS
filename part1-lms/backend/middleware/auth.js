var jwt = require('jsonwebtoken');
var User = require('../models/User');

// verify jwt token and attach user to request
function authMiddleware(req, res, next) {
    var authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided, access denied' });
    }

    var token = authHeader.split(' ')[1];

    try {
        var decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        req.userRole = decoded.role;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
}

// check if user is admin
function adminOnly(req, res, next) {
    if (req.userRole !== 'admin') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
}

module.exports = { authMiddleware: authMiddleware, adminOnly: adminOnly };
