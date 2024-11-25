src/models/job.js
import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  salary: { type: String },
  requirements: [String],
  benefits: [String],
  skills: [String],
  experienceLevel: String,
  employmentType: String,
  deadline: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  views: { type: Number, default: 0 }
});

jobSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Jobs', jobSchema);