// src/service/crawler.js
import puppeteer from 'puppeteer';
import mongoose from 'mongoose';
import Company from '../models/Company.js';
import Job from '../models/Job.js';

async function crawlSaraminJobs() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    await page.goto('https://www.saramin.co.kr/zf_user/jobs/list/job-category');
    
    const jobs = await page.evaluate(() => {
      const items = document.querySelectorAll('.item_recruit');
      return Array.from(items).map(item => ({
        title: item.querySelector('.job_tit')?.textContent.trim(),
        company: item.querySelector('.company_nm')?.textContent.trim(),
        location: item.querySelector('.work_place')?.textContent.trim(),
        salary: item.querySelector('.salary')?.textContent.trim(),
        experience: item.querySelector('.experience')?.textContent.trim(),
        description: item.querySelector('.job_sector')?.textContent.trim()
      }));
    });

    // DB에 저장
    for (const job of jobs) {
      const company = await Company.findOneAndUpdate(
        { name: job.company },
        { 
          name: job.company,
          location: job.location
        },
        { upsert: true, new: true }
      );

      await Job.create({
        title: job.title,
        company: company._id,
        location: job.location,
        salary: job.salary,
        experienceLevel: job.experience,
        description: job.description
      });
    }

    console.log(`Crawled and saved ${jobs.length} jobs`);
  } catch (error) {
    console.error('Crawling error:', error);
  } finally {
    await browser.close();
  }
}