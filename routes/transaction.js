const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transaction');


router.post('/', transactionController.createTransaction);

router.put('/:transactionId/rejected', transactionController.setTransactionRejected);

router.put('/:transactionId/approved', transactionController.setTransactionApproved);

router.get('/', transactionController.getUserTransactions);

router.post('/create-checkout-session', transactionController.createCheckoutSession);

router.get('/success', transactionController.stripeSuccess);

router.post('/cancel', transactionController.stripeCancel);



module.exports = router;
