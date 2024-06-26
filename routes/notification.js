const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notification');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API endpoints for managing notifications
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get user notifications
 *     tags: [Notifications]
 *     responses:
 *       200:
 *         description: A list of user notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   type:
 *                     type: string
 *                   message:
 *                     type: string
 *                   read:
 *                     type: boolean
 *                   UserId:
 *                     type: integer
 *                   TransactionId:
 *                     type: integer
 *                     nullable: true
 *                   ProductId:
 *                     type: integer
 *                     nullable: true
 *                   transaction:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       id:
 *                         type: integer
 *                       date_start:
 *                         type: string
 *                         format: date
 *                       date_end:
 *                         type: string
 *                         format: date
 *                       price_day:
 *                         type: number
 *                       renterUserId:
 *                         type: integer
 *                       ownerUserId:
 *                         type: integer
 *                       state:
 *                         type: string
 *                       ProductId:
 *                         type: integer
 *                   product:
 *                     type: object
 *                     nullable: true
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       value:
 *                         type: number
 *                       price_day:
 *                         type: number
 *                       availability:
 *                         type: string
 *                       brand:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Failed to list user notifications
 */
router.get('/', notificationController.getUserNotifications);

module.exports = router;
