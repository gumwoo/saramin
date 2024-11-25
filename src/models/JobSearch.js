
import mongoose from 'mongoose';

const jobSearchSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  keyword: String,
  filters: {
    location: String,
    experienceLevel: String,
    salary: String,
    skills: [String]
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('JobSearch', jobSearchSchema);