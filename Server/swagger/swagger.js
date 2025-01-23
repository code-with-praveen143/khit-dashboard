const swaggerJsdoc = require('swagger-jsdoc');

// Swagger options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fee Management System API',
      version: '1.0.0',
      description: 'API documentation for the Fee Management System',
    },
    servers: [
      {
        url: 'http://localhost:5001', // Local server URL
        description: 'Local development server',
      },
      {
        url: 'https://osaw.in/v1/payment', // Production server URL
        description: 'Production Server1',
      },
      {
        url: 'https://khit-dashboard.onrender.com', // Production server URL
        description: 'Production Server2',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional, for documentation clarity
        },
      },
    },
    security: [
      {
        bearerAuth: [], // Apply Bearer token authentication globally
      },
    ],
  },
  apis: ['./routes/*.js'], // Automatically include annotations from all route files
};

const swaggerDocs = swaggerJsdoc(options);
module.exports = swaggerDocs;