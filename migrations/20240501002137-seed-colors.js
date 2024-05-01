'use strict'

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const initialUsers = [
            {
                username: 'admin',
                name: 'admin',
                email: 'admin@admin',
                password:
                    '$2b$10$vFT9tEi6Vcd9barNvcqOseYVQCxlrzZDzLarq1dFGxwnTyU3.b9vO',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        ]

        await queryInterface.bulkInsert('Users', initialUsers, {})

        const initialColors = [
            {
                name: 'Azúl',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Vermelho',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Preto',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Branco',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Cinzento',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        ]

        await queryInterface.bulkInsert('Colors', initialColors, {})

        const initialSizes = [
            {
                name: 'XS',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'S',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'M',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'L',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'XL',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'XXL',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: '3XL',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        ]

        await queryInterface.bulkInsert('Sizes', initialSizes, {})

        const initialGrades = [
            {
                name: 'E',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'D',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'C',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'B',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'A',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        ]

        await queryInterface.bulkInsert('Grades', initialGrades, {})

        const initialLocations = [
            {
                name: 'morada',
                address: 'morada teste',
                UserId: 1,
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        ]

        await queryInterface.bulkInsert('Locations', initialLocations, {})

        const initialProductTypes = [
            {
                name: 'Calças',
                category: 'Feminino',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        ]

        await queryInterface.bulkInsert('ProductTypes', initialProductTypes, {})

        const initialProducts = [
            {
                title: 'produto',
                description: 'produto teste',
                value: 200,
                price_day: 20,
                date: '2020-01-01 00:00:00',
                availability: false,
                brand: 'Gucci',
                SizeId: 1,
                ProductTypeId: 1,
                ColorId: 1,
                GradeId: 1,
                UserId: 1,
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        ]

        await queryInterface.bulkInsert('Products', initialProducts, {})
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('Colors', null, {})

        await queryInterface.bulkDelete('Sizes', null, {})

        await queryInterface.bulkDelete('Grades', null, {})

        await queryInterface.bulkDelete('Locations', null, {})

        await queryInterface.bulkDelete('Products', null, {})

        await queryInterface.bulkDelete('ProductTypes', null, {})

        await queryInterface.bulkDelete('Users', null, {})
    },
}
