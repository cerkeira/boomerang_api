const express = require('express');
const router = express.Router();
const extraController = require('../controllers/extra');

/**
 * @swagger
 * /extra/:
 *   get:
 *     summary: Get extras list
 *     tags:
 *       - Extra
 *     responses:
 *       200:
 *         description: A list of extras
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
 *                   value:
 *                     type: integer
 *       500:
 *         description: Failed to retrieve extras
 */
router.get('/', extraController.getExtras);

module.exports = router;
