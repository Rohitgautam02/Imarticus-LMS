var express = require('express');
var router = express.Router();
var Course = require('../models/Course');
var { authMiddleware, adminOnly } = require('../middleware/auth');

// GET /api/courses - list all courses
router.get('/', async function(req, res) {
    try {
        var courses = await Course.find()
            .select('title description instructor duration rating totalRatings enrollments thumbnail')
            .sort({ createdAt: -1 });

        res.json({ courses: courses });
    } catch (err) {
        console.log('Error fetching courses:', err.message);
        res.status(500).json({ message: 'Could not fetch courses' });
    }
});

// GET /api/courses/:id - get single course with all details
router.get('/:id', async function(req, res) {
    try {
        var course = await Course.findById(req.params.id);

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({ course: course });
    } catch (err) {
        console.log('Error fetching course:', err.message);
        res.status(500).json({ message: 'Could not fetch course details' });
    }
});

// POST /api/courses - create course (admin only)
router.post('/', authMiddleware, adminOnly, async function(req, res) {
    try {
        var courseData = req.body;

        var course = new Course(courseData);
        await course.save();

        res.status(201).json({ message: 'Course created', course: course });
    } catch (err) {
        console.log('Error creating course:', err.message);
        res.status(500).json({ message: 'Could not create course' });
    }
});

// PUT /api/courses/:id - update course (admin only)
router.put('/:id', authMiddleware, adminOnly, async function(req, res) {
    try {
        var course = await Course.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.json({ message: 'Course updated', course: course });
    } catch (err) {
        console.log('Error updating course:', err.message);
        res.status(500).json({ message: 'Could not update course' });
    }
});

module.exports = router;
