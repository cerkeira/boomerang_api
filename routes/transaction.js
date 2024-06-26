const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction');

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: API endpoints for managing transactions
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date_start:
 *                 type: string
 *                 format: date
 *               date_end:
 *                 type: string
 *                 format: date
 *               productId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 */
router.post('/', transactionController.createTransaction);

/**
 * @swagger
 * /transactions/{transactionId}/rejected:
 *   put:
 *     summary: Set transaction to rejected
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the transaction
 *     responses:
 *       200:
 *         description: Transaction rejected successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.put('/:transactionId/rejected', transactionController.setTransactionRejected);

/**
 * @swagger
 * /transactions/{transactionId}/approved:
 *   put:
 *     summary: Approve a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the transaction
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               ownerUserAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction approved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction or address not found
 *       500:
 *         description: Server error
 */
router.put('/:transactionId/approved', transactionController.setTransactionApproved);

/**
 * @swagger
 * /transactions/{transactionId}/cancelled:
 *   put:
 *     summary: Cancel a transaction
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the transaction
 *     responses:
 *       200:
 *         description: Transaction cancelled successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.put('/:transactionId/cancelled', transactionController.setTransactionCancelled);

/**
 * @swagger
 * /transactions/success:
 *   get:
 *     summary: Handle Stripe success
 *     tags: [Transactions]
 *     parameters:
 *       - in: query
 *         name: session_id
 *         schema:
 *           type: string
 *         required: true
 *         description: Stripe session ID
 *     responses:
 *       200:
 *         description: Transaction successful
 *       404:
 *         description: Session not found
 *       500:
 *         description: Server error
 */
router.get('/success', transactionController.stripeSuccess);

/**
 * @swagger
 * /transactions/{transactionId}/inTransit:
 *   put:
 *     summary: Set transaction to in transit
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the transaction
 *     responses:
 *       200:
 *         description: Transaction set to in transit successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.put('/:transactionId/inTransit', transactionController.setTransactionInTransit);

/**
 * @swagger
 * /transactions/{transactionId}/inUse:
 *   put:
 *     summary: Set transaction to in use
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the transaction
 *     responses:
 *       200:
 *         description: Transaction set to in use successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.put('/:transactionId/inUse', transactionController.setTransactionInUse);

/**
 * @swagger
 * /transactions/{transactionId}/shipping:
 *   put:
 *     summary: Set transaction to shipping
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the transaction
 *     responses:
 *       200:
 *         description: Transaction set to shipping successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.put('/:transactionId/shipping', transactionController.setTransactionShipping);

/**
 * @swagger
 * /transactions/{transactionId}/completed:
 *   put:
 *     summary: Set transaction to completed
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the transaction
 *     responses:
 *       200:
 *         description: Transaction completed successfully
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Server error
 */
router.put('/:transactionId/completed', transactionController.setTransactionCompleted);

/**
 * @swagger
 * /transactions/{transactionId}:
 *   get:
 *     summary: Get a user's transactions
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         schema:
 *           type: integer
 *         required: false
 *         description: ID of the transaction
 *     responses:
 *       200:
 *         description: Transactions retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction or user not found
 *       500:
 *         description: Server error
 */
router.get('/:transactionId?', transactionController.getUserTransactions);

/**
 * @swagger
 * /transactions/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               transactionId:
 *                 type: integer
 *               selectedExtras:
 *                 type: array
 *                 items:
 *                   type: integer
 *               renterUserAddress:
 *                 type: string
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *       404:
 *         description: Transaction or address not found
 *       500:
 *         description: Server error
 */
router.post('/create-checkout-session', transactionController.createCheckoutSession);

module.exports = router;
