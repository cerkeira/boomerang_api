const { faker } = require('@faker-js/faker');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const usersData = [];

        for (let i = 2; i < 12; i++) {
            usersData.push({
                username: faker.internet.userName(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                gender: faker.helpers.arrayElement(['male', 'female']),
                bio: faker.person.bio(),
                password:
                    '$2b$10$vFT9tEi6Vcd9barNvcqOseYVQCxlrzZDzLarq1dFGxwnTyU3.b9vO',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }

        await queryInterface.bulkInsert('Users', usersData, {});

        const locationsData = [];

        for (let i = 2; i < 12; i++) {
            locationsData.push({
                name: faker.location.city(),
                address: faker.location.streetAddress(),
                postalCode: faker.location.zipCode(),
                UserId: i,
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            });
        }

        await queryInterface.bulkInsert('Locations', locationsData, {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Users', null, {});
        await queryInterface.bulkDelete('Locations', null, {});
    },
};
