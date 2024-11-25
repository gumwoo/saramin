
import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../app.js';
import Job from '../models/Job.js';
import User from '../models/User.js';

describe('Jobs API', () => {
  let authToken;
  let testJob;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
    
    // 테스트 사용자 생성 및 로그인
    const user = await User.create({
      email: 'test@example.com',
      password: Buffer.from('password123').toString('base64'),
      name: 'Test User'
    });

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    
    authToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe('GET /api/jobs', () => {
    test('should return paginated jobs', async () => {
      const response = await request(app).get('/api/jobs');
      expect(response.status).toBe(200);
      expect(response.body.data.jobs).toBeDefined();
      expect(response.body.pagination).toBeDefined();
    });
  });

  describe('GET /api/jobs/search', () => {
    test('should filter jobs by location', async () => {
      const response = await request(app)
        .get('/api/jobs/search')
        .query({ location: '서울' });
      
      expect(response.status).toBe(200);
      response.body.data.jobs.forEach(job => {
        expect(job.location).toMatch(/서울/i);
      });
    });
  });
});