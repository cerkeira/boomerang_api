const express = require('express');
const router = express.Router();
const popularController = require('../controllers/popular');

/**
 * @swagger
 * /popular/categories:
 *   get:
 *     summary: Get popular categories
 *     tags:
 *       - Popular
 *     responses:
 *       200:
 *         description: A list of popular categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   timesUsedCount:
 *                     type: integer
 *       500:
 *         description: Failed to retrieve popular categories
 */
router.get('/categories', popularController.getPopularCategories);

module.exports = router;
