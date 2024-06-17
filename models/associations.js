const User = require('./user')
const Location = require('./location')
const Transaction = require('./transaction')
const State = require('./state')
const Cupon = require('./cupon')
const Product = require('./product')
const Favorite = require('./favorite')
// const Extra = require('./extra')
// const Fee = require('./fee')
// const Transaction_has_extra = require('./transaction_has_extra')
// const Transaction_has_fee = require('./transaction_has_fee')

const defineAssociations = () => {
    User.hasMany(Location, { onDelete: 'CASCADE' })
    Location.belongsTo(User)
    Transaction.belongsTo(Cupon)
    Cupon.hasOne(Transaction)
    Transaction.belongsTo(Product)
    Product.hasMany(Transaction)
    Transaction.belongsTo(State)
    State.hasMany(Transaction)
    User.belongsToMany(Product, { through: Favorite, foreignKey: 'userId' });
    Product.belongsToMany(User, { through: Favorite, foreignKey: 'productId' });
    // eslint-disable-next-line max-len
    // Transaction.belongsToMany(Extra, { through: Transaction_has_extra, foreignKey: 'transactionId' });
    // Extra.belongsToMany(Transaction, { through: Transaction_has_extra, foreignKey: 'extraId' });
    // eslint-disable-next-line max-len
    // Transaction.belongsToMany(Fee, { through: Transaction_has_fee, foreignKey: 'transactionId' });
    // Fee.belongsToMany(Transaction, { through: Transaction_has_fee, foreignKey: 'feeId' });
    User.hasMany(Transaction, { foreignKey: 'renterUserId', as: 'RentedTransactions' });
    Transaction.belongsTo(User, { foreignKey: 'renterUserId', as: 'Renter' });
    User.hasMany(Transaction, { foreignKey: 'ownerUserId', as: 'OwnedTransactions' });
    Transaction.belongsTo(User, { foreignKey: 'ownerUserId', as: 'Owner' });
}

module.exports = defineAssociations
