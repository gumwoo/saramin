//src/models/job.js
import mongoose from 'mongoose';

const jobAnalyticsSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  viewCount: { type: Number, default: 0 },
  applicationCount: { type: Number, default: 0 },
  bookmarkCount: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model('JobAnalytics', jobAnalyticsSchema);