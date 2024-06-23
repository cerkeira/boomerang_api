const User = require('./user');
const Location = require('./location');
const Transaction = require('./transaction');
const Cupon = require('./cupon');
const Product = require('./product');
const Favorite = require('./favorite');

const defineAssociations = () => {
    User.hasMany(Location, { onDelete: 'CASCADE' });
    Location.belongsTo(User);
    Transaction.belongsTo(Cupon);
    Cupon.hasOne(Transaction);
    Transaction.belongsTo(Product);
    Product.hasMany(Transaction);
    User.belongsToMany(Product, { through: Favorite, foreignKey: 'userId' });
    Product.belongsToMany(User, { through: Favorite, foreignKey: 'productId' });
    User.hasMany(Transaction, {
        foreignKey: 'renterUserId',
        as: 'RentedTransactions',
    });
    Transaction.belongsTo(User, { foreignKey: 'renterUserId', as: 'Renter' });
    User.hasMany(Transaction, {
        foreignKey: 'ownerUserId',
        as: 'OwnedTransactions',
    });
    Transaction.belongsTo(User, { foreignKey: 'ownerUserId', as: 'Owner' });
    User.hasMany(Product, { foreignKey: 'UserId', as: 'products' });
};

module.exports = defineAssociations;
