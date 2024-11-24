// 새로운 파일: src/tests/api.test.js
import request from 'supertest';
import { app } from '../app.js';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Job from '../models/Job.js';

describe('Auth API', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('회원가입', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@test.com',
        password: 'password123',
        name: 'Test User'
      });
    
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('success');
  });

  test('로그인', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@test.com',
        password: 'password123'
      });
    
    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('token');
  });
});

describe('Jobs API', () => {
  test('채용공고 목록 조회', async () => {
    const res = await request(app).get('/api/jobs');
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.jobs)).toBe(true);
  });
});