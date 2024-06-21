const ProductType = require('../models/productType');
const { Sequelize } = require('sequelize');

exports.getPopularCategories = async (req, res) => {
    try {
        const categories = await ProductType.findAll({
            attributes: [
                'id',
                'name',
                [
                    Sequelize.literal(`(
                        SELECT COUNT(*)
                        FROM "Transactions" AS transaction
                        WHERE (transaction.log::jsonb->'product'->>'ProductTypeId')::TEXT = "ProductTypes"."id"::TEXT
                    )`),
                    'timesUsedCount'
                ],
            ],
            order: [[Sequelize.literal('"timesUsedCount"'), 'DESC']],
            limit: 10,
        });

        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to retrieve popular categories' });
    }
};
