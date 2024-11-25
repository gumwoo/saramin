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

    // 조회수 증가 및 분석 데이터 업데이트
    await JobAnalytics.findOneAndUpdate(
      { job: job._id },
      { $inc: { viewCount: 1 } },
      { upsert: true }
    );

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

// 검색 및 필터링 로직 강화
jobsRouter.get('/search', async (req, res) => {
  try {
    const {
      keyword,
      location,
      experienceLevel,
      minSalary,
      maxSalary,
      skills,
      page = 1,
      limit = 20
    } = req.query;

    const query = {};
    const skip = (page - 1) * limit;

    // 키워드 검색
    if (keyword) {
      query.$or = [
        { title: new RegExp(keyword, 'i') },
        { description: new RegExp(keyword, 'i') }
      ];
    }

    // 위치 필터
    if (location) {
      query.location = new RegExp(location, 'i');
    }

    // 경력 필터
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    // 급여 범위 필터
    if (minSalary || maxSalary) {
      query.salary = {};
      if (minSalary) query.salary.$gte = parseInt(minSalary);
      if (maxSalary) query.salary.$lte = parseInt(maxSalary);
    }

    // 기술 스택 필터
    if (skills) {
      const skillsArray = skills.split(',').map(skill => skill.trim());
      query.skills = { $all: skillsArray };
    }

    const jobs = await Job.find(query)
      .populate('company')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments(query);

    // 검색 이력 저장 (인증된 사용자의 경우)
    if (req.user) {
      await JobSearch.create({
        user: req.user._id,
        keyword,
        filters: {
          location,
          experienceLevel,
          salary: `${minSalary}-${maxSalary}`,
          skills: skills ? skills.split(',') : []
        }
      });
    }

    res.json({
      status: 'success',
      data: { jobs },
      pagination: {
        currentPage: parseInt(page),
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
