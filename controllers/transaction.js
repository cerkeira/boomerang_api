const Product = require('../models/product');
const Transaction = require('../models/transaction');
const Extra = require('../models/extra');
const User = require('../models/user');
const { Op } = require('sequelize');
// eslint-disable-next-line import/no-extraneous-dependencies
const stripe = require('stripe')('sk_test_51PJCQdFBiJETLeRnI4a0tuJgzArGvSqzN8Y2PQaA7x79dx0eVgJMQENX255WHg6ypwLopaENc6nhs5aaVXB5qZCT00N7KhoDdT');


exports.createTransaction = async (req, res) => {
    const {
        date_start, date_end, productId
    } = req.body;

    const loggedUser = req.session.user;
    if (!loggedUser) {
        return res.status(401).json({ message: 'User not found' });
    }

    const user = await User.findOne({ where: { username: loggedUser } });

    const renterUserId = user.id;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        
        const { price_day } = product;
        const state = 'approved';

        const ownerUserId = product.UserId;

        const transaction = await Transaction.create({
            date_start,
            date_end,
            price_day,
            renterUserId,
            ownerUserId,
            state,
            ProductId: productId,
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.setTransactionRejected = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        transaction.StateId = 'rejected';
        await transaction.save();

        res.json({ transaction_id: transaction.id, state_id: transaction.StateId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setTransactionApproved = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        transaction.StateId = 'approved';
        await transaction.save();

        res.json({ transaction_id: transaction.id, state_id: transaction.StateId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setTransactionInTransit = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        transaction.StateId = 'transit';
        await transaction.save();

        res.json({ transaction_id: transaction.id, state_id: transaction.StateId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setTransactionInUse = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        transaction.StateId = 'delivered';
        await transaction.save();

        res.json({ transaction_id: transaction.id, state_id: transaction.StateId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getUserTransactions = async (req, res) => {
    const loggedUser = req.session.user;
    if (!loggedUser) {
        return res.status(401).json({ message: 'User not found' });
    }

    try {
        const user = await User.findOne({ where: { username: loggedUser } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const transactions = await Transaction.findAll({
            where: {
                [Op.or]: [
                    { renterUserId: user.id },
                    { ownerUserId: user.id }
                ]
            },
        });

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.createCheckoutSession = async (req, res) => {
    const { transactionId, selectedExtras, renterUserAddress } = req.body;

    try {
        const transaction = await Transaction.findByPk(transactionId, {
            include: [Product]
        });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        let totalPrice = transaction.log.price;

        if (selectedExtras && selectedExtras.length > 0) {
            const extraRecords = await Extra.findAll({ where: { id: selectedExtras } });
            extraRecords.forEach((extra) => {
                totalPrice += extra.value;
            });
        }

        if (!renterUserAddress) {
            return res.status(404).json({ error: 'Address not found' });
        }

        req.session.selectedExtras = selectedExtras;

        const api = 'http://localhost:3000';

        const sessionData = {
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: transaction.log.product.title,
                        description: transaction.log.product.description,
                        images: ['https://example.com/product-image.jpg'],
                    },
                    unit_amount: totalPrice * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${api}/transaction/success?transactionId=${transactionId}&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel-url`,
            metadata: {
                transactionId: transactionId,
                renterUserAddress: renterUserAddress,
            }
        };

        if (selectedExtras) {
            sessionData.metadata.selectedExtras = selectedExtras;
        }

        const session = await stripe.checkout.sessions.create(sessionData);

        res.json({ id: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


exports.stripeSuccess = async (req, res) => {
    const { session_id } = req.query;

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const selectedExtras = req.session.selectedExtras || [];
        const { transactionId, renterUserAddress } = session.metadata;

        const transaction = await Transaction.findByPk(transactionId, {
            include: [Product]
        });
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const product = await Transaction.findByPk(transaction.productId);

        console.log(transaction.log.product)

        const transactionLog = {
            product: {
                id: product.id,
                title: product.title,
                description: product.description,
                value: product.value,
                ProductTypeId: product.ProductTypeId,
                price_day: product.price_day,
                availability: product.availability,
                brand: product.brand
            },
            totalPrice: null,
            cupon: null,
            fees: null,
            extras: null,
        };

        // Add renterAddress to the log
        transaction.log.renterUserAddress = renterUserAddress;

        // Add extras to the log if there are any
        if (selectedExtras.length > 0) {
            const extraRecords = await Extra.findAll({ where: { id: selectedExtras } });
            transaction.log.extras = extraRecords.map((extra) => ({
                id: extra.id,
                name: extra.name,
                value: extra.value
            }));
        }


        // Update the transaction state to 'paid'
        transaction.StateId = 'paid';

        transaction.log = transactionLog;

        await transaction.save();

        // Clear the selectedExtras from the session
        req.session.selectedExtras = null;

        const domain = 'http://localhost:3001';
        console.log(session.metadata);

        res.redirect(`${domain}/transaction-success`);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};



exports.stripeCancel = async (req, res) => {
    res.redirect('/shrek-store');
};
