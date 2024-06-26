const Product = require('../models/product');
const Transaction = require('../models/transaction');
const Extra = require('../models/extra');
const User = require('../models/user');
const { Op } = require('sequelize');
const { differenceInCalendarDays } = require('date-fns');
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
    const existingUser = await User.findOne({
        where: { username: loggedUser },
    });

    const user = await User.findOne({ where: { username: loggedUser } });

    const renterUserId = user.id;

    try {
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const { price_day } = product;
        const state = 'pending';

        const ownerUserId = product.UserId;

        if (ownerUserId === existingUser.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

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

    const loggedUser = req.session.user;
    if (!loggedUser) {
        return res.status(401).json({ message: 'User not found' });
    }
    const existingUser = await User.findOne({
        where: { username: loggedUser },
    });

    try {
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (transaction.ownerUserId !== existingUser.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        transaction.state = 'rejected';
        await transaction.save();

        res.json({ transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setTransactionCancelled = async (req, res) => {
    const { transactionId } = req.params;

    const loggedUser = req.session.user;
    if (!loggedUser) {
        return res.status(401).json({ message: 'User not found' });
    }
    const existingUser = await User.findOne({
        where: { username: loggedUser },
    });

    try {
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (transaction.renterUserId !== existingUser.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        transaction.state = 'cancelled';
        await transaction.save();

        res.json({ transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setTransactionApproved = async (req, res) => {
    const { transactionId } = req.params;
    const { ownerUserAddress } = req.body;

    const loggedUser = req.session.user;
    if (!loggedUser) {
        return res.status(401).json({ message: 'User not found' });
    }
    const existingUser = await User.findOne({
        where: { username: loggedUser },
    });

    try {
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        if (transaction.ownerUserId !== existingUser.id) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        if (!ownerUserAddress) {
            return res.status(404).json({ error: 'Missing Address' });
        }

        transaction.ownerUserAddress = ownerUserAddress;
        transaction.state = 'approved';
        await transaction.save();

        res.json({ transaction });
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

        transaction.state = 'transit';
        await transaction.save();

        res.json({ transaction });
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

        transaction.state = 'delivered';
        await transaction.save();

        res.json({ transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getUserTransactions = async (req, res) => {
    const { transactionId } = req.params;
    const loggedUser = req.session.user;
    if (!loggedUser) {
        return res.status(401).json({ message: 'User not found' });
    }

    try {
        const user = await User.findOne({ where: { username: loggedUser } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        let transactions;

        if (transactionId) {
            transactions = await Transaction.findByPk(transactionId, {
                include: [Product]
            });
            if (!transactions) {
                return res.status(404).json({ error: 'Transaction not found' });
            }
            if (transactions.renterUserId !== user.id && transactions.ownerUserId !== user.id) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
        } else {
            transactions = await Transaction.findAll({
                where: {
                    [Op.or]: [
                        { renterUserId: user.id },
                        { ownerUserId: user.id }
                    ]
                },
                include: [Product]
            });
        }

        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCheckoutSession = async (req, res) => {
    const { transactionId, selectedExtras, renterUserAddress } = req.body;

    let totalPrice;
    try {
        const transaction = await Transaction.findByPk(transactionId, {
            include: [Product]
        });
        if (!transaction) {
            return res.status(404)
                .json({ error: 'Transaction not found' });
        }

        // eslint-disable-next-line max-len
        const days = differenceInCalendarDays(new Date(transaction.date_end), new Date(transaction.date_start)) + 1;
        totalPrice = transaction.Product.price_day * days;

        let extraRecords;

        if (selectedExtras && selectedExtras.length > 0) {
            extraRecords = await Extra.findAll({ where: { id: selectedExtras } });
            extraRecords.forEach((extra) => {
                totalPrice += extra.value;
            });
        }

        if (!renterUserAddress) {
            return res.status(404)
                .json({ error: 'Address not found' });
        }

        // eslint-disable-next-line max-len
        const productImage = transaction.Product.productImage ? transaction.Product.productImage : [];
        const api = 'http://localhost:3000'

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: transaction.Product.title,
                        description: transaction.Product.description,
                        images: productImage,
                    },
                    unit_amount: totalPrice * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${api}/transaction/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/transaction-error`,
            metadata: {
                transactionId: transactionId,
                renterUserAddress: JSON.stringify(renterUserAddress),
                selectedExtras: JSON.stringify(extraRecords)
            }
        });

        console.log(session)

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.stripeSuccess = async (req, res) => {
    const { session_id } = req.query;

    try {
        console.log('hello')
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const { transactionId, renterUserAddress, selectedExtras } = session.metadata;
        console.log(transactionId);
        console.log(renterUserAddress);
        console.log(selectedExtras);

        res.redirect('http://localhost:3001/transaction-success');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




exports.workAround = async (req, res) => {
    const { transactionId, selectedExtras, renterUserAddress } = req.body;

    let totalPrice;
    try {
        const transaction = await Transaction.findByPk(transactionId, {
            include: [Product]
        });
        if (!transaction) {
            return res.status(404)
                .json({ error: 'Transaction not found' });
        }

        const product = await Product.findByPk(transaction.ProductId);
        // eslint-disable-next-line max-len
        const days = differenceInCalendarDays(new Date(transaction.date_end), new Date(transaction.date_start)) + 1;
        totalPrice = product.price_day * days;

        let extras = null;
        let extrasTotal = 0;

        if (selectedExtras && selectedExtras.length > 0) {
            const extraRecords = await Extra.findAll({ where: { id: selectedExtras } });
            extras = extraRecords.map((extra) => ({
                id: extra.id,
                name: extra.name,
                value: extra.value
            }));
            extrasTotal = extraRecords.reduce((sum, extra) => sum + extra.value, 0);
        }

        totalPrice += extrasTotal;

        const order = {
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
            totalPrice: totalPrice,
            coupon: null,
            fees: null,
            extras: extras,
        };
        transaction.renterUserAddress = renterUserAddress;
        transaction.state = 'paid';
        transaction.order = order;

        await transaction.save();


        const domain = 'http://localhost:3001';

        res.redirect(`${domain}/`);
    } catch (error) {
        console.error(error);
        res.status(500)
            .json({ error: error.message });
    }
};


exports.stripeCancel = async (req, res) => {
    res.redirect('/shrek-store');
};
