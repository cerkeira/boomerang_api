const Product = require('../models/product');
const Transaction = require('../models/transaction');
const Cupon = require('../models/cupon');
const State = require('../models/state');
const Extra = require('../models/extra');
const Fee = require('../models/fee');
const User = require('../models/user');
const { Op } = require('sequelize');
// eslint-disable-next-line import/no-extraneous-dependencies
const { differenceInCalendarDays } = require('date-fns');
// eslint-disable-next-line import/no-extraneous-dependencies
const stripe = require('stripe')('sk_test_51PJCQdFBiJETLeRnI4a0tuJgzArGvSqzN8Y2PQaA7x79dx0eVgJMQENX255WHg6ypwLopaENc6nhs5aaVXB5qZCT00N7KhoDdT');


const getStateIdByName = async (stateName) => {
    const state = await State.findOne({ where: { name: stateName } });
    if (!state) {
        throw new Error('State not found');
    }
    return state.id;
};


exports.createTransaction = async (req, res) => {
    const {
        date_start, date_end, date, productId, cuponId, fees, extras
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

        const days = differenceInCalendarDays(new Date(date_end), new Date(date_start)) + 1;
        const price = product.price_day * days;

        const ownerUserId = product.UserId;

        const stateId = await getStateIdByName('pending');

        const cupon = cuponId ? await Cupon.findByPk(cuponId) : null;
        if (cuponId && !cupon) {
            return res.status(404).json({ error: 'Cupon not found' });
        }

        const feeRecords = fees ? await Fee.findAll({ where: { id: fees } }) : [];
        if (fees && feeRecords.length !== fees.length) {
            return res.status(404).json({ error: 'One or more fees not found' });
        }

        const extraRecords = extras ? await Extra.findAll({ where: { id: extras } }) : [];
        if (extras && extraRecords.length !== extras.length) {
            return res.status(404).json({ error: 'One or more extras not found' });
        }

        const transactionLog = {
            date,
            date_start,
            date_end,
            price,
            renterUserId,
            ownerUserId,
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
            state: {
                id: stateId,
                name: 'pending'
            },
            cupon: cupon ? {
                id: cupon.id,
                name: cupon.name,
                value: cupon.value,
                percentage: cupon.percentage,
                availability: cupon.availability
            } : null,
            fees: feeRecords.map((fee) => ({
                id: fee.id,
                name: fee.name,
                value: fee.value,
                percentage: fee.percentage
            })),
            extras: extraRecords.map((extra) => ({
                id: extra.id,
                name: extra.name,
                value: extra.value
            }))
        };

        const transaction = await Transaction.create({
            date,
            price,
            renterUserId,
            ownerUserId,
            log: transactionLog,
            ProductId: productId,
            StateId: stateId,
            CuponId: cuponId,
            fees: feeRecords.map((fee) => ({
                id: fee.id,
                name: fee.name,
                value: fee.value,
                percentage: fee.percentage
            })),
            extras: extraRecords.map((extra) => ({
                id: extra.id,
                name: extra.name,
                value: extra.value
            }))
        });

        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.setTransactionRejected = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const stateId = await getStateIdByName('rejected');
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        transaction.StateId = stateId;
        await transaction.save();

        res.json({ transaction_id: transaction.id, state_id: transaction.StateId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setTransactionApproved = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const stateId = await getStateIdByName('approved');
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        transaction.StateId = stateId;
        await transaction.save();

        res.json({ transaction_id: transaction.id, state_id: transaction.StateId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setTransactionInTransit = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const stateId = await getStateIdByName('in transit');
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        transaction.StateId = stateId;
        await transaction.save();

        res.json({ transaction_id: transaction.id, state_id: transaction.StateId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setTransactionInUse = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const stateId = await getStateIdByName('in use');
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        transaction.StateId = stateId;
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
            attributes: ['log']
        });

        const transactionLogs = transactions.map((transaction) => transaction.log);

        res.json(transactionLogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.createCheckoutSession = async (req, res) => {
    const { transactionId, selectedExtras } = req.body;

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

        req.session.selectedExtras = selectedExtras;

        const api = 'http://localhost:3000';

        const session = await stripe.checkout.sessions.create({
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
                transactionId: transactionId // Store transactionId in metadata
            }
        });

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
        const { transactionId } = session.metadata;

        const transaction = await Transaction.findByPk(transactionId);
        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        const extraRecords = await Extra.findAll({ where: { id: selectedExtras } });

        transaction.extras = extraRecords.map((extra) => ({
            id: extra.id,
            name: extra.name,
            value: extra.value
        }));

        await transaction.save();

        req.session.selectedExtras = null;

        const domain = 'http://localhost:3001';
        console.log(session.metadata)

        res.redirect(`${domain}/transaction-success`)
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
};


exports.stripeCancel = async (req, res) => {
    res.redirect('/shrek-store');
};
