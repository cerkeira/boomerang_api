const User = require('../models/user');
const { Sequelize } = require('sequelize');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'username', 'name', 'email', 'gender', 'bio'],
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user.' });
    }
};

exports.getUser = async (req, res) => {
    const { id } = req.params;
    console.log('id', id);
    try {
        const users = await User.findByPk(id);
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch user.' });
    }
};

exports.searchUsersByUsername = async (req, res) => {
    try {
        const { username, page } = req.query;
        const limit = 20;
        const offset = (page - 1) * limit;

        const users = await User.findAll({
            where: {
                username: {
                    [Sequelize.Op.like]: `%${username}%`,
                },
            },
            attributes: ['username', 'name'],
            limit,
            offset,
        });

        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search users.' });
    }
};
