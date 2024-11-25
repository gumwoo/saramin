
import puppeteer from 'puppeteer';
import { delay } from '../utils/common.js';
import Company from '../models/Company.js';
import Job from '../models/Job.js';

class JobCrawler {
  constructor() {
    this.baseUrl = 'https://www.saramin.co.kr/zf_user/jobs/list/job-category';
    this.currentPage = 1;
    this.totalJobs = 0;
  }

  async initialize() {
    this.browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
  }

  async crawlJobs(targetCount = 100) {
    try {
      await this.initialize();
      
      while (this.totalJobs < targetCount) {
        const pageUrl = `${this.baseUrl}?page=${this.currentPage}`;
        await this.page.goto(pageUrl, { waitUntil: 'networkidle0' });
        
        const jobs = await this.extractJobsFromPage();
        await this.saveJobs(jobs);
        
        this.currentPage++;
        await delay(1000); // 1초 딜레이로 서버 부하 방지
      }
      
      console.log(`Successfully crawled ${this.totalJobs} jobs`);
    } catch (error) {
      console.error('Crawling error:', error);
      throw error;
    } finally {
      await this.browser.close();
    }
  }

  async extractJobsFromPage() {
    return await this.page.evaluate(() => {
      const items = document.querySelectorAll('.item_recruit');
      return Array.from(items).map(item => ({
        title: item.querySelector('.job_tit a')?.textContent?.trim(),
        company: item.querySelector('.company_nm a')?.textContent?.trim(),
        location: item.querySelector('.work_place')?.textContent?.trim(),
        salary: item.querySelector('.salary')?.textContent?.trim(),
        experience: item.querySelector('.experience')?.textContent?.trim(),
        education: item.querySelector('.education')?.textContent?.trim(),
        description: item.querySelector('.job_sector')?.textContent?.trim(),
        deadline: item.querySelector('.deadline')?.textContent?.trim(),
        jobType: item.querySelector('.employment_type')?.textContent?.trim(),
        skills: Array.from(item.querySelectorAll('.job_meta_tx')).map(skill => skill.textContent.trim())
      }));
    });
  }

  async saveJobs(jobs) {
    for (const jobData of jobs) {
      try {
        // 회사 정보 저장 또는 업데이트
        const company = await Company.findOneAndUpdate(
          { name: jobData.company },
          {
            name: jobData.company,
            location: jobData.location
          },
          { upsert: true, new: true }
        );

        // 중복 채용공고 체크
        const existingJob = await Job.findOne({
          title: jobData.title,
          company: company._id
        });

        if (!existingJob) {
          await Job.create({
            title: jobData.title,
            company: company._id,
            description: jobData.description,
            location: jobData.location,
            salary: jobData.salary,
            experienceLevel: jobData.experience,
            skills: jobData.skills,
            employmentType: jobData.jobType,
            deadline: jobData.deadline
          });
          this.totalJobs++;
        }
      } catch (error) {
        console.error(`Error saving job: ${error.message}`);
        continue; // 한 건의 실패가 전체 프로세스를 중단하지 않도록 함
      }
    }
  }
}

export default JobCrawler;