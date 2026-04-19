const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const socketIO = require('../socket');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

router.post('/create', auth, async (req, res) => {
  try {
    const { title, description, skill, coordinates } = req.body;
    const job = new Job({
      title, description, skill,
      client: req.user.id,
      location: { type: 'Point', coordinates }
    });
    await job.save();

    const nearbyWorkers = await User.find({
      role: 'worker',
      skill: skill,
      available: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates },
          $maxDistance: 10000
        }
      }
    });

    nearbyWorkers.forEach(worker => {
      socketIO.getIO().emit(`job_for_${worker._id}`, {
        jobId: job._id,
        title,
        description,
        skill
      });
    });

    res.json({ message: 'Job posted!', job, nearbyWorkers: nearbyWorkers.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/accept/:id', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id,
      { status: 'accepted', worker: req.user.id },
      { new: true }
    );
    res.json({ message: 'Job accepted!', job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/open', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'open' }).populate('client', 'name');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/myjobs', auth, async (req, res) => {
  try {
    const jobs = await Job.find({ client: req.user.id }).populate('worker', 'name rating');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put('/complete/:id', auth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    const job = await Job.findByIdAndUpdate(req.params.id,
      { status: 'completed', rating, review },
      { new: true }
    );
    const worker = await User.findById(job.worker);
    const newTotal = worker.totalReviews + 1;
    const newRating = ((worker.rating * worker.totalReviews) + rating) / newTotal;
    await User.findByIdAndUpdate(job.worker, { rating: newRating, totalReviews: newTotal });

    res.json({ message: 'Job completed and reviewed!', job });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;