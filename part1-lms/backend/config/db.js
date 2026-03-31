var mongoose = require('mongoose');

// connect to mongodb atlas
function connectDB() {
    var uri = process.env.MONGO_URI;

    if (!uri) {
        console.log('Error: MONGO_URI is not defined in .env file');
        process.exit(1);
    }

    mongoose.connect(uri)
        .then(function() {
            console.log('Connected to MongoDB Atlas');
        })
        .catch(function(err) {
            console.log('MongoDB connection failed:', err.message);
            process.exit(1);
        });

    mongoose.connection.on('disconnected', function() {
        console.log('MongoDB disconnected');
    });

    mongoose.connection.on('error', function(err) {
        console.log('MongoDB error:', err.message);
    });
}

module.exports = connectDB;
