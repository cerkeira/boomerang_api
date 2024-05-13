const State = require('../models/state');

exports.getAllStates = async (req, res) => {
    try {
        const states = await State.findAll({
            attributes: ['id', 'name'],
        });
        res.json(states);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:
                'Erro. Mas este endpoint tbm não serve para nada, por isoo ¯_(ツ)_/¯',
        });
    }
};
