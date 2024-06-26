const Product = require('../models/product');
const Transaction = require('../models/transaction');
const Extra = require('../models/extra');
const User = require('../models/user');
const { Op } = require('sequelize');
const { differenceInCalendarDays } = require('date-fns');
// eslint-disable-next-line import/no-extraneous-dependencies
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
// Secret key do stripe



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

        //  Transação inicializada com o estado pending
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

exports.setTransactionShipping = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        transaction.state = 'shipping';
        await transaction.save();

        res.json({ transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.setTransactionCompleted = async (req, res) => {
    const { transactionId } = req.params;

    try {
        const transaction = await Transaction.findByPk(transactionId);

        if (!transaction) {
            return res.status(404).json({ error: 'Transaction not found' });
        }

        transaction.state = 'completed';
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

//  Fetch de transações, tanto como owner como renter
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

        // Preço pelo número de dias
        const days = differenceInCalendarDays(new Date(transaction.date_end), new Date(transaction.date_start)) + 1;
        totalPrice = transaction.Product.price_day * days;

        // Soma do preço dos extras ao preço total
        let extraRecords;

        // Taxa de proteção
        totalPrice += (totalPrice * 0.05) + 2;

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

        //  URL da API retirada do .env
        const api = process.env.BASE_URL

        //  Alteração dos detalhes da sessão de checkout para corresponder à nossa app
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: transaction.Product.title,
                        description: transaction.Product.description,
                    },
                    unit_amount: totalPrice * 100,
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${api}transaction/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/transaction-error`,
            metadata: {
                transactionId: transactionId,
                renterUserAddress: JSON.stringify(renterUserAddress),
                selectedExtras: JSON.stringify(extraRecords),
                totalPrice: totalPrice,
                domain: req.headers.origin,
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
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (!session) {
            return res.status(404).json({ error: 'Session not found' });
        }

        const { transactionId, renterUserAddress, selectedExtras, totalPrice, domain } = session.metadata;
        console.log(transactionId);
        console.log(renterUserAddress);
        console.log(selectedExtras);

        const transaction = await Transaction.findByPk(transactionId, {
            include: [Product]
        });
        if (!transaction) {
            return res.status(404)
                .json({ error: 'Transaction not found' });
        }

        const product = await Product.findByPk(transaction.ProductId);

        // Criação do JSON não variável de precaução
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
            fees: [
                {
                    name: 'Taxa de Proteção',
                    value: 2,
                    porcentage: 5,
                }
            ],
            extras: JSON.parse(selectedExtras),
        };

        transaction.renterUserAddress = JSON.parse(renterUserAddress);
        transaction.state = 'paid';
        transaction.order = order;

        await transaction.save();

    // Redirect para a página de sucesso pós-pagamento
        res.redirect(`${domain}/transaction-success`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
