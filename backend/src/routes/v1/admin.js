const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser } = require('../../controllers/adminController');
const { protect, authorizeRoles } = require('../../middleware/auth');

// All admin routes require authentication + admin role
router.use(protect, authorizeRoles('admin'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only endpoints
 */

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Forbidden - admin only
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /api/v1/admin/users/{id}:
 *   delete:
 *     summary: Delete a user and their tasks (admin only)
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', deleteUser);

module.exports = router;
