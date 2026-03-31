var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var Razorpay = require('razorpay');
var User = require('../models/User');
var { authMiddleware } = require('../middleware/auth');

// initialise razorpay instance
function getRazorpayInstance() {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
}

// POST /api/payment/create-order - create razorpay order
router.post('/create-order', authMiddleware, async function(req, res) {
    try {
        var razorpay = getRazorpayInstance();

        var options = {
            amount: 50000, // amount in paise (Rs 500)
            currency: 'INR',
            receipt: 'order_' + Date.now(),
            notes: {
                userId: req.userId,
                purpose: 'LMS Course Access'
            }
        };

        var order = await razorpay.orders.create(options);

        res.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID
        });

    } catch (err) {
        console.log('Create order error:', err.message);
        res.status(500).json({ message: 'Could not create payment order' });
    }
});

// POST /api/payment/verify - verify payment and grant access
router.post('/verify', authMiddleware, async function(req, res) {
    try {
        var { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return res.status(400).json({ message: 'Missing payment details' });
        }

        // verify signature
        var body = razorpay_order_id + '|' + razorpay_payment_id;
        var expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest('hex');

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({ message: 'Payment verification failed' });
        }

        // mark user as paid
        await User.findByIdAndUpdate(req.userId, { hasPaid: true });

        res.json({
            message: 'Payment verified successfully',
            paymentId: razorpay_payment_id
        });

    } catch (err) {
        console.log('Payment verify error:', err.message);
        res.status(500).json({ message: 'Payment verification failed' });
    }
});

// GET /api/payment/status - check if user has paid
router.get('/status', authMiddleware, async function(req, res) {
    try {
        var user = await User.findById(req.userId).select('hasPaid');
        res.json({ hasPaid: user.hasPaid });
    } catch (err) {
        res.status(500).json({ message: 'Could not check payment status' });
    }
});

module.exports = router;
