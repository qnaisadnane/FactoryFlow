import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FactoryFlow API',
      version: '1.0.0',
      description: 'API REST de gestion des ordres de fabrication, stocks et ateliers de production',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Serveur local de développement',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Authentification via Token JWT (Format: Bearer <token>)',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/app.js'],
};

export const swaggerSpec = swaggerJsdoc(options);
