//src/config/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Job Search API',
      version: '1.0.0',
      description: 'A job search API',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // 이 부분은 그대로 둡니다
};

export default swaggerJsdoc(options);