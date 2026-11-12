const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  skill: { type: String, required: true },
  status: { type: String, enum: ['open', 'accepted', 'completed'], default: 'open' },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  worker: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  review: { type: String },
  rating: { type: Number }
}, { timestamps: true });

jobSchema.index({ location: '2dsphere' });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ client: 1, createdAt: -1 });
jobSchema.index({ worker: 1, createdAt: -1 });

module.exports = mongoose.model('Job', jobSchema);