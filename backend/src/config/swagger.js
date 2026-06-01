const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TaskFlow API',
      version: '1.0.0',
      description: 'REST API with JWT authentication and role-based access control',
    },
    servers: [
      {
        url: 'http://localhost:5000',
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
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
            name: { type: 'string', example: 'John Doe' },
            email: { type: 'string', example: 'john@example.com' },
            role: { type: 'string', enum: ['user', 'admin'], example: 'user' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Task: {
          type: 'object',
          properties: {
            _id: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0e' },
            title: { type: 'string', example: 'Fix login bug' },
            description: { type: 'string', example: 'JWT token not refreshing properly' },
            status: { type: 'string', enum: ['todo', 'in-progress', 'done'], example: 'todo' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
            owner: { type: 'string', example: '665f1a2b3c4d5e6f7a8b9c0d' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string', example: 'Error message' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/v1/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
