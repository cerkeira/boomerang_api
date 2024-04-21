const State = require('../models/state');
const { Sequelize } = require('sequelize');


exports.getAllStates = async (req, res) => {
    try {
        const states = await State.findAll({
            attributes: [
                'id',
                'name',
            ],
        });
        res.json(states);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Fraco...' });
    }
};