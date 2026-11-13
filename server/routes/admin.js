const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Job = require('../models/Job');
const { adminUserIdSchema, adminStatusSchema, validate } = require('../validation');

const router = express.Router();

const getPagination = query => {
  const parsedPage = Number.parseInt(query.page, 10);
  const parsedLimit = Number.parseInt(query.limit, 10);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 50) : 20;

  return { limit, skip: (page - 1) * limit };
};

const adminAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);

    // Role aur blocked status har request par database se check hote hain
    const account = await User.findById(req.user.id).select('blocked role');
    if (!account || account.blocked) return res.status(401).json({ message: 'Account access denied' });
    if (account.role !== 'admin') return res.status(403).json({ message: 'Admin access required' });

    next();
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    next(err);
  }
};

router.get('/users', adminAuth, async (req, res, next) => {
  try {
    const { limit, skip } = getPagination(req.query);
    const [users, total] = await Promise.all([
      User.find({})
        .select('-password')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments({})
    ]);

    res.set('X-Total-Count', String(total));
    res.json(users.map(user => ({
      ...user.toObject(),
      approved: user.approved !== false
    })));
  } catch (err) {
    next(err);
  }
});

router.get('/jobs', adminAuth, async (req, res, next) => {
  try {
    const { limit, skip } = getPagination(req.query);
    const filter = {};
    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('client', 'name email')
        .populate('worker', 'name email rating totalReviews')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments(filter)
    ]);

    res.set('X-Total-Count', String(total));
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

router.patch('/users/:id/block', adminAuth, validate(adminUserIdSchema, 'params'), validate(adminStatusSchema), async (req, res, next) => {
  try {
    if (req.body.blocked === undefined) return res.status(400).json({ message: 'Blocked status is required' });
    if (String(req.params.id) === String(req.user.id)) return res.status(400).json({ message: 'You cannot block yourself' });

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { blocked: req.body.blocked },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: req.body.blocked ? 'User blocked' : 'User unblocked', user });
  } catch (err) {
    next(err);
  }
});

router.patch('/workers/:id/approval', adminAuth, validate(adminUserIdSchema, 'params'), validate(adminStatusSchema), async (req, res, next) => {
  try {
    if (req.body.approved === undefined) return res.status(400).json({ message: 'Approval status is required' });

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'worker' },
      { approved: req.body.approved },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'Worker not found' });
    res.json({ message: req.body.approved ? 'Worker approved' : 'Worker rejected', user });
  } catch (err) {
    next(err);
  }
});

module.exports = router;