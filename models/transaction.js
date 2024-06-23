const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Notification = require('./Notification');
const User = require('./user');
const Product = require('./product');
const { format } = require('date-fns');
const { pt } = require('date-fns/locale');

const Transaction = sequelize.define('Transaction', {
    date_start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    date_end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    price_day: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    order: {
        type: DataTypes.JSON,
        allowNull: true
    },
    renterUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ownerUserId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    ownerUserAddress: {
        type: DataTypes.JSON,
        allowNull: true
    },
    renterUserAddress: {
        type: DataTypes.JSON,
        allowNull: true
    },
    state: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected', 'paid', 'canceled', 'shipping', 'transit', 'delivered', 'completed'),
        allowNull: false
    },
}, {
    hooks: {
        afterCreate: async (transaction) => {
            try {
                console.log(transaction.id)
                const ownerUser = await User.findByPk(transaction.ownerUserId);
                const item = await Product.findByPk(transaction.ProductId);
                const dateStartFormatted = format(new Date(transaction.date_start), 'dd/MM/yyyy', { locale: pt });
                const dateEndFormatted = format(new Date(transaction.date_end), 'dd/MM/yyyy', { locale: pt });

                await Notification.create({
                    type: 'transaction',
                    title: 'Novo pedido de aluguer recebido',
                    message: `Recebeste um novo pedido de aluguer de ${ownerUser.name} para o item ${item.title} no período de ${dateStartFormatted} a ${dateEndFormatted}.`,
                    TransactionId: transaction.id,
                    UserId: transaction.ownerUserId,
                    ProductId: transaction.ProductId,
                });
            } catch (error) {
                console.error('Error creating notification:', error);
            }
        },
        afterUpdate: async (transaction) => {
            try {
                console.log(transaction.previous('state'))
                console.log(transaction.state)
                if (transaction.previous('state') !== 'approved' && transaction.state === 'approved') {
                    console.log('in')
                    const item = await Product.findByPk(transaction.ProductId);

                    await Notification.create({
                        type: 'transaction',
                        title: 'Pedido de aluguer aprovado',
                        message: `O pedido de aluguer para o item ${item.title} foi aceite. Clica aqui para pagar agora ou cancelar o pedido`,
                        TransactionId: transaction.id,
                        UserId: transaction.renterUserId,
                        ProductId: transaction.ProductId,
                    });
                }
            } catch (error) {
                console.error('Error creating notification:', error);
            }
        },
    }
});

Transaction.belongsTo(Product);

module.exports = Transaction;
