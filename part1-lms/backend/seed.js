require('dotenv').config();
var mongoose = require('mongoose');
var Course = require('./models/Course');
var User = require('./models/User');
var connectDB = require('./config/db');

// sample course data matching the Pegasus LMS structure
var sampleCourse = {
    title: 'Introduction to Machine Learning',
    description: 'Machine learning is a field of computer science that uses statistical techniques to give computer systems the ability to "learn" with data, without being explicitly programmed. The course of Introduction to Machine Learning is a free online certification course. The important elements of the course are Concept Videos, Quizzes, Certification, and Discussion and Mentorship.',
    instructor: 'Ritesh Singh',
    duration: '2 Years',
    rating: 4.5,
    totalRatings: 2510,
    enrollments: 4786,
    thumbnail: '',
    includes: [
        'Concept Videos',
        'Practice Quizzes',
        'Certificate of Completion'
    ],
    learningOutcomes: [
        'Introduction to Machine Learning',
        'Basic Concepts of Machine Learning',
        'Linear Regression, Polynomial Regression, Logistic Regression',
        'Neural Network and Deep Learning'
    ],
    modules: [
        {
            title: 'Introduction to Machine Learning',
            lessons: [
                {
                    title: 'What is Machine Learning?',
                    videoUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU',
                    duration: '15 min',
                    type: 'video'
                },
                {
                    title: 'Types of Machine Learning',
                    videoUrl: 'https://www.youtube.com/embed/1rBpu7bBCO8',
                    duration: '12 min',
                    type: 'video'
                },
                {
                    title: 'Module 1 Quiz',
                    videoUrl: '',
                    duration: '10 min',
                    type: 'quiz'
                }
            ]
        },
        {
            title: 'Concepts of Machine Learning',
            lessons: [
                {
                    title: 'Supervised vs Unsupervised Learning',
                    videoUrl: 'https://www.youtube.com/embed/1FZ0A1QCMWc',
                    duration: '18 min',
                    type: 'video'
                },
                {
                    title: 'Training and Testing Data',
                    videoUrl: 'https://www.youtube.com/embed/d2O4DFpSdEQ',
                    duration: '14 min',
                    type: 'video'
                },
                {
                    title: 'Project: Cost of Flats',
                    videoUrl: 'https://www.youtube.com/embed/nk2CQITm_eo',
                    duration: '20 min',
                    type: 'video'
                }
            ]
        },
        {
            title: 'Linear and Polynomial Regression',
            lessons: [
                {
                    title: 'Linear Regression Explained',
                    videoUrl: 'https://www.youtube.com/embed/7ArmBVF2dCs',
                    duration: '22 min',
                    type: 'video'
                },
                {
                    title: 'Polynomial Regression',
                    videoUrl: 'https://www.youtube.com/embed/QptI-vDle8Y',
                    duration: '16 min',
                    type: 'video'
                },
                {
                    title: 'Logistic Regression',
                    videoUrl: 'https://www.youtube.com/embed/yIYKR4sgzI8',
                    duration: '19 min',
                    type: 'video'
                }
            ]
        },
        {
            title: 'Neural Network and Deep Learning',
            lessons: [
                {
                    title: 'Introduction to Neural Networks',
                    videoUrl: 'https://www.youtube.com/embed/aircAruvnKk',
                    duration: '20 min',
                    type: 'video'
                },
                {
                    title: 'Deep Learning Basics',
                    videoUrl: 'https://www.youtube.com/embed/6M5VXKLf4D4',
                    duration: '25 min',
                    type: 'video'
                }
            ]
        },
        {
            title: 'Application of Deep Learning',
            lessons: [
                {
                    title: 'Spam Email Filter Project',
                    videoUrl: 'https://www.youtube.com/embed/PkZNo7MFNFg',
                    duration: '30 min',
                    type: 'video'
                },
                {
                    title: 'App Recommendation System',
                    videoUrl: 'https://www.youtube.com/embed/n1gYo3-B2lY',
                    duration: '25 min',
                    type: 'video'
                },
                {
                    title: 'Final Assessment',
                    videoUrl: '',
                    duration: '30 min',
                    type: 'quiz'
                }
            ]
        }
    ]
};

// additional courses for a more realistic LMS feel
var additionalCourses = [
    {
        title: 'Financial Analysis Fundamentals',
        description: 'Learn the core concepts of financial analysis including ratio analysis, financial statement interpretation, and forecasting techniques. This course provides a solid foundation for anyone looking to build a career in finance.',
        instructor: 'Priya Sharma',
        duration: '6 Months',
        rating: 4.3,
        totalRatings: 1850,
        enrollments: 3200,
        thumbnail: '',
        includes: ['Video Lectures', 'Case Studies', 'Certificate'],
        learningOutcomes: [
            'Financial Statement Analysis',
            'Ratio Analysis and Interpretation',
            'Cash Flow Forecasting',
            'Valuation Techniques'
        ],
        modules: [
            {
                title: 'Introduction to Finance',
                lessons: [
                    { title: 'What is Financial Analysis?', videoUrl: 'https://www.youtube.com/embed/KFOuGIaHYSk', duration: '12 min', type: 'video' },
                    { title: 'Types of Financial Statements', videoUrl: 'https://www.youtube.com/embed/WEDIj9JBTC8', duration: '15 min', type: 'video' }
                ]
            },
            {
                title: 'Ratio Analysis',
                lessons: [
                    { title: 'Liquidity Ratios', videoUrl: 'https://www.youtube.com/embed/H-GDMhPe7zY', duration: '18 min', type: 'video' },
                    { title: 'Profitability Ratios', videoUrl: 'https://www.youtube.com/embed/WEDIj9JBTC8', duration: '16 min', type: 'video' }
                ]
            }
        ]
    },
    {
        title: 'Data Analytics with Python',
        description: 'A hands-on course covering data analytics using Python. Learn to work with pandas, numpy, matplotlib, and build data pipelines for real-world analysis tasks.',
        instructor: 'Amit Verma',
        duration: '4 Months',
        rating: 4.6,
        totalRatings: 3100,
        enrollments: 5400,
        thumbnail: '',
        includes: ['Coding Exercises', 'Projects', 'Certificate'],
        learningOutcomes: [
            'Python for Data Analysis',
            'Working with Pandas and NumPy',
            'Data Visualisation with Matplotlib',
            'Building Data Pipelines'
        ],
        modules: [
            {
                title: 'Getting Started with Python',
                lessons: [
                    { title: 'Python Setup and Basics', videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8', duration: '20 min', type: 'video' },
                    { title: 'Variables and Data Types', videoUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8', duration: '15 min', type: 'video' }
                ]
            },
            {
                title: 'Data Manipulation with Pandas',
                lessons: [
                    { title: 'Introduction to Pandas', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', duration: '22 min', type: 'video' },
                    { title: 'DataFrames and Series', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', duration: '18 min', type: 'video' }
                ]
            }
        ]
    }
];

async function seedDatabase() {
    try {
        await connectDB();

        // wait a bit for connection
        await new Promise(function(resolve) { setTimeout(resolve, 2000); });

        console.log('Clearing existing data...');
        await Course.deleteMany({});

        console.log('Seeding courses...');
        await Course.create(sampleCourse);
        for (var i = 0; i < additionalCourses.length; i++) {
            await Course.create(additionalCourses[i]);
        }

        console.log('Courses seeded successfully');

        // create default admin user if it doesnt exist
        var adminExists = await User.findOne({ email: 'admin@imarticus.com' });
        if (!adminExists) {
            var admin = new User({
                name: 'Admin',
                email: 'admin@imarticus.com',
                password: 'admin123',
                role: 'admin',
                hasPaid: true
            });
            await admin.save();
            console.log('Admin user created (admin@imarticus.com / admin123)');
        }

        console.log('Seed completed');
        process.exit(0);

    } catch (err) {
        console.log('Seed error:', err.message);
        process.exit(1);
    }
}

seedDatabase();
