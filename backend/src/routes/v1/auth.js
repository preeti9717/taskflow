const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../../controllers/authController');
const { protect } = require('../../middleware/auth');
const { registerValidation, loginValidation } = require('../../validators');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *                 example: Jane Doe
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already in use
 *       422:
 *         description: Validation error
 */
router.post('/register', registerValidation, register);

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login and receive JWT token
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: jane@example.com
 *               password:
 *                 type: string
 *                 example: secret123
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginValidation, login);

/**
 * @swagger
 * /api/v1/auth/profile:
 *   get:
 *     summary: Get current logged-in user profile
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Profile data
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', protect, getProfile);

module.exports = router;
