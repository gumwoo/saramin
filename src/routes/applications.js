import express from 'express';
import Application from '../models/Application.js';
import { auth } from '../middleware/auth.js';

const applicationsRouter = express.Router();

/**
 * @swagger
 * /api/applications:
 *   post:
 *     tags: [Applications]
 *     summary: Apply for a job
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: string
 */
applicationsRouter.post('/', auth, async (req, res) => {
  try {
    const { jobId } = req.body;
    
    const existingApplication = await Application.findOne({
      job: jobId,
      user: req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({
        status: 'error',
        message: 'You have already applied for this job'
      });
    }

    const application = await Application.create({
      job: jobId,
      user: req.user._id
    });

    res.status(201).json({
      status: 'success',
      data: { application }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

applicationsRouter.get('/', auth, async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('job')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: { applications }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

applicationsRouter.delete('/:id', auth, async (req, res) => {
  try {
    const application = await Application.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!application) {
      return res.status(404).json({
        status: 'error',
        message: 'Application not found'
      });
    }

    res.json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export { applicationsRouter };