# Job Search API

구인구직 정보를 제공하는 RESTful API 서버

## 기능
- 사람인 채용정보 크롤링
- JWT 기반 사용자 인증
- 채용공고 검색 및 필터링
- 지원 및 북마크 기능
- 상세한 API 문서화

## 설치 및 실행

1. 의존성 설치
 - npm install

2. 환경 변수 설정
 - cp .env.example .env

3. 데이터 크롤링

 - npm run crawl

4. 서버 실행
 - npm start

5. 테스트 실행
 - npm test

## API 문서
Swagger UI: http://localhost:3000/api-docs

## 데이터베이스 스키마
User: 사용자 정보
Job: 채용공고 정보
Company: 회사 정보
Application: 지원 정보
Bookmark: 북마크 정보
JobAnalytics: 채용공고 통계
JobSearch: 검색 이력

## 주요 API 엔드포인트
POST /api/auth/register: 회원가입
POST /api/auth/login: 로그인
GET /api/jobs: 채용공고 목록
GET /api/jobs/search: 채용공고 검색
POST /api/applications: 지원하기
POST /api/bookmarks: 북마크 추가/제거
