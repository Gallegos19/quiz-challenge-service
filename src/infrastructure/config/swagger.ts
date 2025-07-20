import { Express } from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export const setupSwagger = (app: Express) => {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Quiz Service API',
        version: '1.0.0',
        description: 'API documentation for the Quiz microservice',
        contact: {
          name: 'Development Team'
        },
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3004}${process.env.API_PREFIX || '/api/quiz'}`,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    },
    apis: ['./src/infrastructure/web/routes/*.ts', './src/infrastructure/web/controllers/*.ts'],
  };

  const specs = swaggerJSDoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};