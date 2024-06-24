const sequelize = require('../db');
const User = require('./user')
const Product = require('./product')
const { DataTypes } = require('sequelize');
const Notification = require('./notification');

const Favorite = sequelize.define('Favorite', {
    productId: { type: DataTypes.INTEGER, references: { model: Product } },
    userId: { type: DataTypes.INTEGER, references: { model: User } }

}, {
    timestamps: false,
    hooks: {
        afterCreate: async (favorite) => {
            try {
                const product = await Product.findByPk(favorite.productId);
                const user = await User.findByPk(favorite.userId);

                await Notification.create({
                    type: 'favorite',
                    title: 'Novo favorito',
                    message: `${user.username} favoritou ${product.title}.`,
                    UserId: product.UserId,
                    ProductId: product.id,
                    FavoriteId: favorite.userId,
                });
            } catch (error) {
                console.error('Error creating notification:', error);
            }
        }
    }
});



module.exports = Favorite;
