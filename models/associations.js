const User = require('./user')
const Location = require('./location')

const defineAssociations = () => {
    User.hasMany(Location, { onDelete: 'CASCADE' })
    Location.belongsTo(User)
}

module.exports = defineAssociations
