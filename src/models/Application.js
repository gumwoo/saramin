
import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
  resumeUrl: String,
  createdAt: { type: Date, default: Date.now }
});

applicationSchema.index({ job: 1, user: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);