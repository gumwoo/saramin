// src/routes/jobs.js
import express from 'express';
import Job from '../models/Job.js';
import { auth } from '../middleware/auth.js'; // auth 미들웨어 가져오기

const jobsRouter = express.Router();

// 채용 공고 목록 조회 (인증이 필요 없는 경우)
jobsRouter.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const jobs = await Job.find()
      .populate('company')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments();

    res.json({
      status: 'success',
      data: { jobs },
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

// 특정 채용 공고 조회 (인증이 필요 없는 경우)
jobsRouter.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate('company');
    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // 조회수 증가
    job.views += 1;
    await job.save();

    res.json({
      status: 'success',
      data: { job }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// 채용 공고 등록 (인증이 필요한 경우)
jobsRouter.post('/', auth, async (req, res) => { // auth 미들웨어 적용
  try {
    const { title, description, company } = req.body;
    const job = new Job({
      title,
      description,
      company,
      postedBy: req.user._id
    });

    await job.save();

    res.status(201).json({
      status: 'success',
      data: { job }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// 검색 기능 추가 (jobs.js에 추가할 내용)
jobsRouter.get('/search', async (req, res) => {
  try {
    const { keyword, location, experienceLevel, salary } = req.query;
    const query = {};

    if (keyword) {
      query.$or = [
        { title: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') }
      ];
    }
    
    if (location) query.location = new RegExp(location, 'i');
    if (experienceLevel) query.experienceLevel = experienceLevel;
    if (salary) query.salary = new RegExp(salary, 'i');

    const jobs = await Job.find(query)
      .populate('company')
      .sort({ createdAt: -1 });

    res.json({
      status: 'success',
      data: { jobs }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// 통계 API (새로운 파일: statistics.js)

const statisticsRouter = express.Router();

statisticsRouter.get('/job-stats', async (req, res) => {
  try {
    const stats = await Job.aggregate([
      {
        $group: {
          _id: '$location',
          count: { $sum: 1 },
          avgSalary: { $avg: '$salary' }
        }
      }
    ]);

    res.json({
      status: 'success',
      data: { stats }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export { jobsRouter };
