const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const Job = require('../models/Job');

const router = express.Router();

// Demo ke liye fixed price (rupees), skill ke hisaab se. Price server tay karta hai, client nahi.
const PRICE_BY_SKILL = { Plumber: 500, Electrician: 600, Carpenter: 700, Painter: 800, Cleaner: 400 };
const DEFAULT_PRICE = 500;

const requireMock = (req, res, next) => {
  if (process.env.ALLOW_MOCK_PAYMENTS !== 'true' || !process.env.MOCK_GATEWAY_SECRET) {
    return res.status(503).json({ message: 'Payments are not available right now' });
  }
  next();
};

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    const account = await User.findById(req.user.id).select('blocked');
    if (!account || account.blocked) return res.status(401).json({ message: 'Account access denied' });
    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    next(err);
  }
};

router.use(requireMock, auth);

const sign = (orderId, paymentId) =>
  crypto.createHmac('sha256', process.env.MOCK_GATEWAY_SECRET).update(`${orderId}|${paymentId}`).digest('hex');

const safeEqual = (a, b) => {
  const bufA = Buffer.from(String(a));
  const bufB = Buffer.from(String(b));
  return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
};

const isId = value => typeof value === 'string' && mongoose.isValidObjectId(value);

// Step 1: client apni completed job ke liye order banata hai
router.post('/create-order', async (req, res, next) => {
  try {
    const { jobId } = req.body;
    if (!isId(jobId)) return res.status(400).json({ message: 'Invalid job id' });

    const job = await Job.findById(jobId).select('client status skill payment');
    if (!job || String(job.client) !== String(req.user.id)) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (job.status !== 'completed') return res.status(400).json({ message: 'Only completed jobs can be paid' });
    if (job.payment?.status === 'paid') return res.status(409).json({ message: 'Job is already paid' });

    const amount = PRICE_BY_SKILL[job.skill] || DEFAULT_PRICE;
    const orderId = `order_${crypto.randomBytes(8).toString('hex')}`;

    const updated = await Job.findOneAndUpdate(
      { _id: jobId, client: req.user.id, status: 'completed', 'payment.status': { $ne: 'paid' } },
      { $set: { 'payment.status': 'pending', 'payment.orderId': orderId, 'payment.amount': amount } },
      { new: true }
    );
    if (!updated) return res.status(409).json({ message: 'Job is already paid' });

    res.json({ orderId, amount, currency: 'INR', jobId });
  } catch (err) {
    next(err);
  }
});

// Step 2: DEMO GATEWAY. Asli Razorpay mein ye hissa Razorpay Checkout karta hai.
router.post('/mock-gateway/pay', async (req, res, next) => {
  try {
    const { orderId } = req.body;
    if (typeof orderId !== 'string') return res.status(400).json({ message: 'Invalid order id' });

    const job = await Job.findOne({
      'payment.orderId': orderId,
      client: req.user.id,
      'payment.status': 'pending'
    }).select('_id');
    if (!job) return res.status(404).json({ message: 'Order not found' });

    const paymentId = `pay_${crypto.randomBytes(8).toString('hex')}`;
    res.json({ paymentId, signature: sign(orderId, paymentId) });
  } catch (err) {
    next(err);
  }
});

// Step 3: server signature verify karke job ko paid mark karta hai (atomic, ek hi baar)
router.post('/verify', async (req, res, next) => {
  try {
    const { jobId, orderId, paymentId, signature } = req.body;
    if (!isId(jobId) || ![orderId, paymentId, signature].every(v => typeof v === 'string')) {
      return res.status(400).json({ message: 'Invalid payment details' });
    }
    if (!safeEqual(sign(orderId, paymentId), signature)) {
      return res.status(400).json({ message: 'Payment verification failed' });
    }

    const job = await Job.findOneAndUpdate(
      { _id: jobId, client: req.user.id, status: 'completed', 'payment.orderId': orderId, 'payment.status': 'pending' },
      { $set: { 'payment.status': 'paid', 'payment.paymentId': paymentId, 'payment.paidAt': new Date() } },
      { new: true }
    ).select('payment');
    if (!job) return res.status(409).json({ message: 'Payment already processed or order not found' });

    res.json({ message: 'Payment successful', payment: { status: job.payment.status, amount: job.payment.amount } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
