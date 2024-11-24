
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Company from '../models/Company.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // Create test companies
    const companies = await Company.create([
      {
        name: '테크 컴퍼니',
        description: 'IT 기업',
        location: '서울',
        industry: 'IT',
      },
      {
        name: '스타트업',
        description: '성장중인 스타트업',
        location: '부산',
        industry: '서비스',
      }
    ]);

    // Create test jobs
    await Job.create([
      {
        title: '프론트엔드 개발자',
        company: companies[0]._id,
        description: 'React 개발자 구합��다',
        location: '서울',
        salary: '4000-5000만원',
        requirements: ['React', 'JavaScript'],
        experienceLevel: '3년 이상',
      },
      {
        title: '백엔드 개발자',
        company: companies[1]._id,
        description: 'Node.js 개발자 구합니다',
        location: '부산',
        salary: '3500-4500만원',
        requirements: ['Node.js', 'MongoDB'],
        experienceLevel: '2년 이상',
      }
    ]);

    console.log('Test data created successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();