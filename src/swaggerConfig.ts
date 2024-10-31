// src/swaggerConfig.ts
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';
const parentDir = path.resolve(__dirname, '..');

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Express TypeScript API Documentation',
      servers: [{ url: "http://localhost:4201/" }],
    },
  },
  apis: ['./src/controller/dummy/dummy.docs.ts', './src/controller/user/user.docs.ts', './src/controller/project/project.yaml', './src/swagger/*.yaml'],
};

console.log(parentDir);

const swaggerSpec = swaggerJsdoc(options);
export default swaggerSpec;
