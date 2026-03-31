var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var fs = require('fs');
var Document = require('../models/Document');
var { authMiddleware } = require('../middleware/auth');

// set up multer for file uploads
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var uploadDir = path.join(__dirname, '..', 'uploads');
        // make sure uploads folder exists
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function(req, file, cb) {
        // add timestamp to avoid name collisions
        var uniqueName = Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

// only allow certain file types
var fileFilter = function(req, file, cb) {
    var allowedTypes = ['.pdf', '.docx', '.doc', '.txt'];
    var ext = path.extname(file.originalname).toLowerCase();

    if (allowedTypes.indexOf(ext) !== -1) {
        cb(null, true);
    } else {
        cb(new Error('Only PDF, DOCX, and TXT files are allowed'), false);
    }
};

var upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// POST /api/documents/upload - upload a document
router.post('/upload', authMiddleware, upload.single('document'), async function(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        var title = req.body.title || req.file.originalname;

        var doc = new Document({
            title: title,
            originalName: req.file.originalname,
            filePath: req.file.path,
            fileType: path.extname(req.file.originalname).toLowerCase(),
            fileSize: req.file.size,
            uploadedBy: req.userId
        });

        await doc.save();

        res.status(201).json({
            message: 'Document uploaded successfully',
            document: doc
        });

    } catch (err) {
        console.log('Upload error:', err.message);
        res.status(500).json({ message: 'Failed to upload document' });
    }
});

// POST /api/documents/:id/summarise - generate AI summary
router.post('/:id/summarise', authMiddleware, async function(req, res) {
    try {
        var doc = await Document.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        // read the file content based on type
        var textContent = '';

        if (doc.fileType === '.txt') {
            textContent = fs.readFileSync(doc.filePath, 'utf-8');
        }
        else if (doc.fileType === '.pdf') {
            var pdfParse = require('pdf-parse');
            var pdfBuffer = fs.readFileSync(doc.filePath);
            var pdfData = await pdfParse(pdfBuffer);
            textContent = pdfData.text;
        }
        else if (doc.fileType === '.docx' || doc.fileType === '.doc') {
            var mammoth = require('mammoth');
            var result = await mammoth.extractRawText({ path: doc.filePath });
            textContent = result.value;
        }

        if (!textContent || textContent.trim().length === 0) {
            return res.status(400).json({ message: 'Could not extract text from the document' });
        }

        // trim to first 5000 chars to stay within api limits
        if (textContent.length > 5000) {
            textContent = textContent.substring(0, 5000);
        }

        // call gemini api for summarisation
        var { GoogleGenerativeAI } = require('@google/generative-ai');
        var genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        var model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        var prompt = 'Summarise the following document in clear, concise bullet points. '
            + 'Keep the summary informative and well-structured. '
            + 'Focus on the main ideas and key takeaways.\n\n'
            + 'Document content:\n' + textContent;

        var result = await model.generateContent(prompt);
        var summary = result.response.text();

        // save summary to database
        doc.summary = summary;
        await doc.save();

        res.json({
            message: 'Summary generated successfully',
            summary: summary
        });

    } catch (err) {
        console.log('Summarise error:', err.message);
        res.status(500).json({ message: 'Failed to generate summary. Check your API key.' });
    }
});

// GET /api/documents - list user's documents
router.get('/', authMiddleware, async function(req, res) {
    try {
        var documents = await Document.find({ uploadedBy: req.userId })
            .sort({ createdAt: -1 });

        res.json({ documents: documents });
    } catch (err) {
        res.status(500).json({ message: 'Could not fetch documents' });
    }
});

// GET /api/documents/:id - get single document
router.get('/:id', authMiddleware, async function(req, res) {
    try {
        var doc = await Document.findById(req.params.id);

        if (!doc) {
            return res.status(404).json({ message: 'Document not found' });
        }

        res.json({ document: doc });
    } catch (err) {
        res.status(500).json({ message: 'Could not fetch document' });
    }
});

module.exports = router;
