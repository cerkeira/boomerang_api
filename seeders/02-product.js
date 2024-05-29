const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const productsData = [];

        for (let i = 2; i < 12; i++) {
            productsData.push({
                title: faker.commerce.productName(),
                description: faker.commerce.productDescription(),
                value: faker.commerce.price({ min: 100 }),
                price_day: faker.commerce.price({ max: 30 }),
                availability: false,
                brand: faker.helpers.arrayElement([
                    'Gucci',
                    'Prada',
                    'Louis Vuitton',
                    'Giovani Gali',
                    'Lacoste',
                    'Nixon',
                    'Zara',
                    'Timberland',
                ]),
                SizeId: Math.floor(Math.random() * (7 - 1 + 1) + 1),
                ProductTypeId: 1,
                ColorId: Math.floor(Math.random() * (5 - 1 + 1) + 1),
                GradeId: Math.floor(Math.random() * (5 - 1 + 1) + 1),
                UserId: i,
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            });
        }

        await queryInterface.bulkInsert('Products', productsData, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Products', null, {});
    },
};
