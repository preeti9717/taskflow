const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');
const { sendError } = require('./utils/response');

const authRoutes = require('./routes/v1/auth');
const taskRoutes = require('./routes/v1/tasks');
const adminRoutes = require('./routes/v1/admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date().toISOString() });
});

// API v1 Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/tasks', taskRoutes);
app.use('/api/v1/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  return sendError(res, 404, `Route ${req.originalUrl} not found`);
});

// Global error handler
app.use(errorHandler);

module.exports = app;
