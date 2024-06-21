const Extra = require('../models/extra');

exports.getExtras = async (req, res) => {
    try {
        const extras = await Extra.findAll({
            attributes: ['id', 'name', 'value'],
        });
        res.json(extras);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message:
                'Error fetching extras',
        });
    }
};
