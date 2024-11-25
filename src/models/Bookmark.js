//src/models/bookmarks.js
import mongoose from 'mongoose';

const bookmarkSchema = new mongoose.Schema({
  job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

bookmarkSchema.index({ job: 1, user: 1 }, { unique: true });

export default mongoose.model('Bookmark', bookmarkSchema);