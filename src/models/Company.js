//src/models/applications.js
import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  location: String,
  industry: String,
  size: String,
  website: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Company', companySchema);