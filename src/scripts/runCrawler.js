
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import JobCrawler from '../crawler/jobCrawler.js';

dotenv.config();

const runCrawler = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const crawler = new JobCrawler();
    await crawler.crawlJobs(150); // 여유있게 150개 수집 시도

    console.log('Crawling completed successfully');
  } catch (error) {
    console.error('Crawling failed:', error);
  } finally {
    await mongoose.connection.close();
  }
};

runCrawler();