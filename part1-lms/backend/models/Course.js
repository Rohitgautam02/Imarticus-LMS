var mongoose = require('mongoose');

// lesson schema - nested inside modules
var lessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        default: ''
    },
    duration: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['video', 'quiz', 'reading'],
        default: 'video'
    }
});

// module schema - nested inside course
var moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    lessons: [lessonSchema]
});

// main course schema
var courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    instructor: {
        type: String,
        required: true
    },
    duration: {
        type: String,
        default: ''
    },
    rating: {
        type: Number,
        default: 0
    },
    totalRatings: {
        type: Number,
        default: 0
    },
    enrollments: {
        type: Number,
        default: 0
    },
    thumbnail: {
        type: String,
        default: ''
    },
    includes: [{
        type: String
    }],
    learningOutcomes: [{
        type: String
    }],
    modules: [moduleSchema],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

var Course = mongoose.model('Course', courseSchema);

module.exports = Course;
