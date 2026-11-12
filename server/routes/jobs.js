const express = require('express');
const router = express.Router();
const Job = require('../models/Job');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const socketIO = require('../socket');
const {
  createJobSchema,
  jobIdSchema,
  completeJobSchema,
  startJobSchema,
  cancelJobSchema,
  validate
} = require('../validation');

const getPagination = query => {
  const parsedPage = Number.parseInt(query.page, 10);
  const parsedLimit = Number.parseInt(query.limit, 10);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const limit = Number.isInteger(parsedLimit) && parsedLimit > 0 ? Math.min(parsedLimit, 50) : 20;

  return { page, limit, skip: (page - 1) * limit };
};

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

router.post('/create', auth, validate(createJobSchema), async (req, res, next) => {
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
    }).limit(50);

    nearbyWorkers.forEach(worker => {
      socketIO.getIO().to(`worker:${worker._id}`).emit('job:new', {
        jobId: job._id,
        title,
        description,
        skill
      });
    });

    res.json({ message: 'Job posted!', job, nearbyWorkers: nearbyWorkers.length });
  } catch (err) {
    next(err);
  }
});

router.put('/accept/:id', auth, validate(jobIdSchema, 'params'), async (req, res, next) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Only workers can accept jobs' });
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, status: 'open' },
      { status: 'accepted', worker: req.user.id },
      { new: true }
    );

    if (!job) {
      return res.status(409).json({ message: 'Job is no longer available' });
    }

    socketIO.getIO().to(`client:${job.client}`).emit('booking:accepted', {
      jobId: job._id,
      status: job.status
    });

    res.json({ message: 'Job accepted!', job });
  } catch (err) {
    next(err);
  }
});

router.put('/start/:id', auth, validate(jobIdSchema, 'params'), validate(startJobSchema), async (req, res, next) => {
  try {
    if (req.user.role !== 'worker') {
      return res.status(403).json({ message: 'Only workers can start jobs' });
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, status: 'accepted', worker: req.user.id },
      { status: 'in_progress' },
      { new: true }
    );

    if (!job) {
      return res.status(409).json({ message: 'Job is not available to start' });
    }

    socketIO.getIO().to(`client:${job.client}`).emit('booking:started', {
      jobId: job._id,
      status: job.status
    });

    res.json({ message: 'Job started!', job });
  } catch (err) {
    next(err);
  }
});

router.put('/cancel/:id', auth, validate(jobIdSchema, 'params'), validate(cancelJobSchema), async (req, res, next) => {
  try {
    const jobForAuthorization = await Job.findById(req.params.id).select('client worker status');

    if (!jobForAuthorization) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const userId = String(req.user.id);
    const isJobOwner = String(jobForAuthorization.client) === userId;
    const isAssignedWorker = String(jobForAuthorization.worker) === userId;

    if (!isJobOwner && !isAssignedWorker) {
      return res.status(403).json({ message: 'You are not authorized to cancel this job' });
    }

    const { reason } = req.body;
    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, status: { $in: ['accepted', 'in_progress'] } },
      {
        status: 'cancelled',
        cancelledBy: req.user.id,
        cancelledAt: new Date(),
        cancellationReason: reason
      },
      { new: true }
    );

    if (!job) {
      return res.status(409).json({ message: 'Job is not available to cancel' });
    }

    const recipientRole = isJobOwner ? 'worker' : 'client';
    const recipientId = isJobOwner ? job.worker : job.client;
    socketIO.getIO().to(`${recipientRole}:${recipientId}`).emit('booking:cancelled', {
      jobId: job._id,
      status: job.status
    });

    res.json({ message: 'Job cancelled!', job });
  } catch (err) {
    next(err);
  }
});

router.get('/open', auth, async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const [jobs, total] = await Promise.all([
      Job.find({ status: 'open' })
        .populate('client', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Job.countDocuments({ status: 'open' })
    ]);
    res.set('X-Total-Count', String(total));
    res.json(jobs);
  } catch (err) {
    next(err);
  }
});

router.get('/myjobs', auth, async (req, res, next) => {
  try {
    const { page, limit, skip } = getPagination(req.query);
    const filter = { client: req.user.id };
    const [jobs, total] = await Promise.all([
      Job.find(filter)
        .populate('worker', 'name rating')
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

router.put('/complete/:id', auth, validate(jobIdSchema, 'params'), validate(completeJobSchema), async (req, res, next) => {
  try {
    const { rating, review } = req.body;
    const jobForAuthorization = await Job.findById(req.params.id).select('client worker status');

    if (!jobForAuthorization) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const userId = String(req.user.id);
    const isJobOwner = String(jobForAuthorization.client) === userId;
    const isAssignedWorker = String(jobForAuthorization.worker) === userId;

    if (!isJobOwner && !isAssignedWorker) {
      return res.status(403).json({ message: 'You are not authorized to complete this job' });
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, status: { $in: ['accepted', 'in_progress'] } },
      { status: 'completed', rating, review },
      { new: true }
    );

    if (!job) {
      return res.status(409).json({ message: 'Job is not available to complete' });
    }

    const worker = await User.findById(job.worker);
    const newTotal = worker.totalReviews + 1;
    const newRating = ((worker.rating * worker.totalReviews) + rating) / newTotal;
    await User.findByIdAndUpdate(job.worker, { rating: newRating, totalReviews: newTotal });

    socketIO.getIO().to(`worker:${job.worker}`).emit('booking:completed', {
      jobId: job._id,
      status: job.status
    });

    res.json({ message: 'Job completed and reviewed!', job });
  } catch (err) {
    next(err);
  }
});

module.exports = router;