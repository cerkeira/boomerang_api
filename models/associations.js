const User = require('./user')
const Location = require('./location')
const Transaction = require('./transaction')
const State = require('./state')
const Cupon = require('./cupon')
const Product = require('./product')
const Favorite = require('./favorite')


const defineAssociations = () => {
    User.hasMany(Location, { onDelete: 'CASCADE' })
    Location.belongsTo(User)
    Transaction.belongsTo(Cupon)
    Cupon.hasOne(Transaction)
    Transaction.belongsTo(State)
    State.hasMany(Transaction)
    // Product.belongsToMany(User, { through: Favorite, foreignKey: 'productId' });
    // User.belongsToMany(Product, { through: Favorite, foreignKey: 'userId' });

    // Define associations between models
    User.belongsToMany(Product, { through: Favorite, foreignKey: 'userId' });
    Product.belongsToMany(User, { through: Favorite, foreignKey: 'productId' });
}

module.exports = defineAssociations
