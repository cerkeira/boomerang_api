'use strict';

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
                profileImage: '5fdb8143-0801-4e52-bfec-a1e5f909db0b.jpeg',
            },
        ];

        await queryInterface.bulkInsert('Users', initialUsers, {});

        const initialColors = [
            {
                name: 'Azul',
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
                name: 'Amarelo',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Rosa',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Verde',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Roxo',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Multicor',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Laranja',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        ];

        await queryInterface.bulkInsert('Colors', initialColors, {});

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
        ];

        await queryInterface.bulkInsert('Sizes', initialSizes, {});

        const initialGrades = [
            {
                name: 'Satisfatório',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Bom',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Muito Bom',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        ];

        await queryInterface.bulkInsert('Grades', initialGrades, {});

        const initialLocations = [
            {
                name: 'morada',
                address: 'morada teste',
                postalCode: '3810-200',
                UserId: 1,
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        ];

        await queryInterface.bulkInsert('Locations', initialLocations, {});

        const initialProductTypes = [
            {
                name: 'Cerimónia',
                category: 'Feminino',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Vestidos',
                category: 'Feminino',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Camisolas',
                category: 'Feminino',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Casaco',
                category: 'Feminino',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Calças',
                category: 'Feminino',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Saia',
                category: 'Feminino',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Calções',
                category: 'Feminino',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Cerimónia',
                category: 'Masculino',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Camisolas',
                category: 'Masculino',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Casaco',
                category: 'Masculino',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Calças',
                category: 'Masculino',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Calções',
                category: 'Masculino',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: '0-6 meses',
                category: 'Criança',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: '7-18 meses',
                category: 'Criança',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: '1-6 anos',
                category: 'Criança',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: '6-14 anos',
                category: 'Criança',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Etnográfico',
                category: 'Trajes',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Natal',
                category: 'Trajes',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Carnaval',
                category: 'Trajes',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Halloween',
                category: 'Trajes',
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        ];

        await queryInterface.bulkInsert(
            'ProductTypes',
            initialProductTypes,
            {}
        );

        const initialExtras = [
            {
                name: 'Lavandaria Sustentável',
                value: 100,
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            {
                name: 'Transportadora Eco-Friendly',
                value: 300,
                createdAt: Sequelize.literal('CURRENT_TIMESTAMP'),
                updatedAt: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        ];

        await queryInterface.bulkInsert('Extras', initialExtras, {});

        const initialProducts = [
            {
                title: 'produto',
                description: 'produto teste',
                value: 200,
                price_day: 20,
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
        ];

        await queryInterface.bulkInsert('Products', initialProducts, {});
    },

    down: async (queryInterface) => {
        await queryInterface.bulkDelete('Colors', null, {});

        await queryInterface.bulkDelete('Extras', null, {});

        await queryInterface.bulkDelete('Sizes', null, {});

        await queryInterface.bulkDelete('Grades', null, {});

        await queryInterface.bulkDelete('Locations', null, {});

        await queryInterface.bulkDelete('Products', null, {});

        await queryInterface.bulkDelete('ProductTypes', null, {});

        await queryInterface.bulkDelete('Users', null, {});
    },
};
