const Notification = require('../models/notification');
const User = require('../models/user');
const Transaction = require('../models/transaction');
const Product = require('../models/product');

exports.getUserNotifications = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        const existingUser = await User.findOne({
            where: { username: loggedUser },
        });

        const notifications = await Notification.findAll({
            where: { UserId: existingUser.id },
        });

        await Notification.update({
            read: true
        }, {
            where: {
                UserId: existingUser.id,
                read: false
            }
        });

        const transactionNotifications = notifications.filter((notification) => notification.type === 'transaction' || notification.type === 'favorite');

        const transactionIds = transactionNotifications
            .map((notification) => notification.TransactionId)
            .filter((id) => id !== null);

        let transactions = [];
        if (transactionIds.length > 0) {
            transactions = await Transaction.findAll({
                where: { id: transactionIds },
            });
        }

        // Get all productIds from notifications
        const productIds = transactionNotifications
            .filter((notification) => notification.ProductId !== null)
            .map((notification) => notification.ProductId);

        let products = [];
        if (productIds.length > 0) {
            products = await Product.findAll({
                where: { id: productIds },
            });
        }

        const notificationsWithTransactions = notifications.map((notification) => {
            const modifiedNotification = notification.toJSON();
            if (notification.type === 'transaction' || notification.type === 'favorite') {
                // eslint-disable-next-line max-len
                const relatedTransaction = transactions.find((transaction) => transaction.id === notification.TransactionId);
                // eslint-disable-next-line max-len
                modifiedNotification.transaction = relatedTransaction ? relatedTransaction.toJSON() : null;

                if (notification.ProductId) {
                    // eslint-disable-next-line max-len
                    const relatedProduct = products.find((product) => product.id === notification.ProductId);
                    modifiedNotification.product = relatedProduct ? relatedProduct.toJSON() : null;
                }
            }
            return modifiedNotification;
        });

        res.status(200).json(notificationsWithTransactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to list user notifications.' });
    }
};
