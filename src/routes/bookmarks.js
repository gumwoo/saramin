import express from 'express';
import Bookmark from '../models/Bookmark.js';
import { auth } from '../middleware/auth.js';

const bookmarksRouter = express.Router();

/**
 * @swagger
 * /api/bookmarks:
 *   post:
 *     tags: [Bookmarks]
 *     summary: Toggle bookmark for a job
 *     security:
 *       - bearerAuth: []
 */
bookmarksRouter.post('/', auth, async (req, res) => {
  try {
    const { jobId } = req.body;
    
    const existingBookmark = await Bookmark.findOne({
      job: jobId,
      user: req.user._id
    });

    if (existingBookmark) {
      await existingBookmark.remove();
      return res.json({
        status: 'success',
        data: { bookmarked: false }
      });
    }

    const bookmark = await Bookmark.create({
      job: jobId,
      user: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: { bookmark, bookmarked: true }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

bookmarksRouter.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate('job')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Bookmark.countDocuments({ user: req.user._id });

    res.json({
      status: 'success',
      data: { bookmarks },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export { bookmarksRouter };