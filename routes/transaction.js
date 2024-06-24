const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction');

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a transaction
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - date_start
 *               - date_end
 *               - date
 *               - productId
 *             properties:
 *               date_start:
 *                 type: string
 *                 format: date
 *               date_end:
 *                 type: string
 *                 format: date
 *               date:
 *                 type: string
 *                 format: date
 *               productId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Transaction created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Error creating transaction
 */
router.post('/', transactionController.createTransaction);

/**
 * @swagger
 * /transactions/{transactionId}/rejected:
 *   put:
 *     summary: Set transaction as rejected
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction state updated to rejected
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Error updating transaction
 */
router.put('/:transactionId/rejected', transactionController.setTransactionRejected);

/**
 * @swagger
 * /transactions/{transactionId}/approved:
 *   put:
 *     summary: Set transaction as approved
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction state updated to approved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Error updating transaction
 */
router.put('/:transactionId/approved', transactionController.setTransactionApproved);

router.put('/:transactionId/cancelled', transactionController.setTransactionCancelled);

/**
 * @swagger
 * /transactions/{transactionId}/inTransit:
 *   put:
 *     summary: Set transaction as in transit
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction state updated to in transit
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Error updating transaction
 */
router.put('/:transactionId/inTransit', transactionController.setTransactionInTransit);

/**
 * @swagger
 * /transactions/{transactionId}/inUse:
 *   put:
 *     summary: Set transaction as in use
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction state updated to in use
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Error updating transaction
 */
router.put('/:transactionId/inUse', transactionController.setTransactionInUse);

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get user transactions
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: User transactions retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       401:
 *         description: User not found
 *       404:
 *         description: User not found
 *       500:
 *         description: Error retrieving transactions
 */
router.get('/:transactionId?', transactionController.getUserTransactions);

/**
 * @swagger
 * /transactions/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - transactionId
 *             properties:
 *               transactionId:
 *                 type: integer
 *               selectedExtras:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Checkout session created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       404:
 *         description: Transaction not found
 *       500:
 *         description: Error creating checkout session
 */
router.post('/create-checkout-session', transactionController.createCheckoutSession);

/**
 * @swagger
 * /transactions/success:
 *   get:
 *     summary: Handle Stripe success callback
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: query
 *         name: session_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to transaction success page
 *       404:
 *         description: Session not found
 *       500:
 *         description: Error handling success callback
 */
router.get('/success', transactionController.stripeSuccess);


/**
 * @swagger
 * /transactions/cancel:
 *   post:
 *     summary: Handle Stripe cancel callback
 *     tags:
 *       - Transactions
 *     responses:
 *       302:
 *         description: Redirect to cancel page
 */
router.post('/cancel', transactionController.stripeCancel);

module.exports = router;
