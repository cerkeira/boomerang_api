// const db= require('../db/index')
//
//
// const user = {
//
//     find(nameSearch){
//         const {
//             searchString
//           } = nameSearch
//
//
//           const query = `SELECT id_users, username, name, email, gender, bio, images_id_images FROM users WHERE name LIKE ? LIMIT 20`;
//
//           const searchStringFinal = `%${searchString}%`;
//
//         const values = [
//             searchStringFinal
//           ];
//
//           return db.query(query, values);
//
//     }
//
// }
//
//
//
//
// module.exports = user;

const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    const UserModel = sequelize.define('User', {
        username: {
            type: DataTypes.STRING(45),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(34),
            allowNull: false,
        },
        gender: {
            type: DataTypes.STRING(45),
            allowNull: true,
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false,
        },
        bio: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        images_id_images: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    }, {
    });

    return UserModel;
};

