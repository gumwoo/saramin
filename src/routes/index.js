import express from 'express';
import { authRouter } from './auth.js';
import { jobsRouter } from './jobs.js';
import { applicationsRouter } from './applications.js';
import { bookmarksRouter } from './bookmarks.js';

const router = express.Router();

router.use('/auth', authRouter);
router.use('/jobs', jobsRouter);
router.use('/applications', applicationsRouter);
router.use('/bookmarks', bookmarksRouter);

export { router };