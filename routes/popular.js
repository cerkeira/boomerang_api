const express = require('express');
const router = express.Router();
const popularController = require('../controllers/popular');

/**
 * @swagger
 * tags:
 *   name: Popular
 *   description: API endpoints for retrieving popular categories and promoters
 */

/**
 * @swagger
 * /popular/categories:
 *   get:
 *     summary: Get popular categories
 *     tags: [Popular]
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

/**
 * @swagger
 * /popular/promoters:
 *   get:
 *     summary: Get popular promoters
 *     tags: [Popular]
 *     responses:
 *       200:
 *         description: A list of popular promoters
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   username:
 *                     type: string
 *                   profileImage:
 *                     type: string
 *                   timesUsedCount:
 *                     type: integer
 *       500:
 *         description: Failed to retrieve popular promoters
 */
router.get('/promoters', popularController.getPopularPromoters);

module.exports = router;
