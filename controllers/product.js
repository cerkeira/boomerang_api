const Product = require('../models/product');
const Size = require('../models/size');
const ProductType = require('../models/productType');
const Color = require('../models/color');
const Grade = require('../models/grade');
const User = require('../models/user');
const { Sequelize } = require('sequelize');
const Favorite = require('../models/favorite');
const { put } = require('@vercel/blob');

exports.getProduct = async (req, res) => {
    try {
        const { id } = req.query;

        const product = await Product.findAll({
            where: {
                id: id,
            },
            // incluir nomes dos tamanhos e etc.
            include: [
                { model: Size, attributes: ['name'] },
                { model: ProductType, attributes: ['name', 'category'] },
                { model: Color, attributes: ['name'] },
                { model: Grade, attributes: ['name'] },
            ],
        });

        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch product.' });
    }
};

exports.publishProduct = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res.status(403).json({ message: 'User not found' });
        }

        const user = await User.findOne({ where: { username: loggedUser } });

        if (!user) {
            return res.status(403).json({ message: 'User not found' });
        }

        const {
            title,
            description,
            measurements,
            value,
            price_day,
            brand,
            SizeId,
            ProductTypeId,
            ColorId,
            GradeId,
        } = req.body;

        // upload de imagens
        const images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                // definir nome compressed
                const filename = `compressed-${file.filename}`;
                // função da vercel blob para upload
                const blob = await put(filename, file.buffer, {
                    access: 'public',
                    mimetype: file.mimetype,
                    token: process.env.BLOB_READ_WRITE_TOKEN,
                });
                // juntar imagem ao array de 5
                images.push(blob.url);
            }
        }

        const newProduct = await Product.create({
            title,
            description,
            measurements,
            value,
            price_day,
            availability: true,
            brand,
            SizeId,
            ProductTypeId,
            ColorId,
            GradeId,
            UserId: user.id,
            productImage: images,
        });
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error during product creation:', error);
        res.status(500).json({ message: 'Failed to publish product.' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const loggedUser = req.session.user;

        const { id } = req.query;

        const existingProduct = await Product.findByPk(id);

        if (!loggedUser) {
            return res.status(403).json({ message: 'User not found' });
        }
        const user = await User.findOne({ where: { username: loggedUser } });

        if (existingProduct.UserId !== user.id) {
            return res
                .status(403)
                .json({ message: `${user} can't delete ${existingProduct}` });
        }

        await Product.destroy({
            where: {
                id: id,
            },
            attributes: ['id'],
        });

        res.status(200).json({ message: 'Product deleted successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete product.' });
    }
};

exports.editProduct = async (req, res) => {
    try {
        const {
            id,
            title,
            description,
            measurements,
            value,
            price_day,
            availability,
            brand,
            SizeId,
            ProductTypeId,
            ColorId,
            GradeId,
        } = req.body;

        const loggedUser = req.session.user;

        const existingProduct = await Product.findByPk(id);

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        if (!loggedUser) {
            return res.status(403).json({ message: 'User not found' });
        }
        const user = await User.findOne({ where: { username: loggedUser } });

        if (existingProduct.UserId !== user.id) {
            return res
                .status(403)
                .json({ message: `${user} can't edit ${existingProduct}` });
        }

        const images = [];
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const filename = `compressed-${file.filename}`;
                const blob = await put(filename, file.buffer, {
                    access: 'public',
                    mimetype: file.mimetype,
                    token: process.env.BLOB_READ_WRITE_TOKEN,
                });
                images.push(blob.url);
            }
        }

        await existingProduct.update({
            title,
            description,
            measurements,
            value,
            price_day,
            availability,
            brand,
            SizeId,
            ProductTypeId,
            ColorId,
            GradeId,
            productImage: images,
        });

        res.status(200).json(existingProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to edit product.' });
    }
};

// encontrar nome e ids de cada campo necessário para publicar produto
exports.getForm = async (req, res) => {
    try {
        const sizes = await Size.findAll({
            attributes: ['id', 'name'],
        });
        const productTypes = await ProductType.findAll({
            attributes: ['id', 'name', 'category'],
        });
        const colors = await Color.findAll({
            attributes: ['id', 'name'],
        });
        const grades = await Grade.findAll({
            attributes: ['id', 'name'],
        });

        res.status(200).json({
            sizes,
            productTypes,
            colors,
            grades,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch form data.' });
    }
};

exports.searchProducts = async (req, res) => {
    try {
        const {
            name,
            size,
            color,
            category,
            gender,
            brand,
            orderBy,
            orderDirection,
        } = req.query;

        const whereCondition = {};
        const orderCondition = [];

        if (name) {
            whereCondition.title = {
                [Sequelize.Op.iLike]: `%${name}%`,
            };
        }

        if (size) {
            whereCondition['$Size.name$'] = {
                [Sequelize.Op.iLike]: `%${size}%`,
            };
        }

        if (color) {
            whereCondition['$Color.name$'] = {
                [Sequelize.Op.iLike]: `%${color}%`,
            };
        }

        if (category) {
            whereCondition['$ProductType.name$'] = {
                [Sequelize.Op.iLike]: `%${category}%`,
            };
        }

        if (gender) {
            whereCondition['$ProductType.category$'] = {
                [Sequelize.Op.iLike]: `%${gender}%`,
            };
        }

        if (brand) {
            whereCondition.brand = {
                [Sequelize.Op.iLike]: `%${brand}%`,
            };
        }

        if (
            orderBy &&
            (orderDirection === 'ASC' || orderDirection === 'DESC')
        ) {
            orderCondition.push([orderBy, orderDirection]);
        }

        const products = await Product.findAll({
            where: whereCondition,
            include: [
                { model: Size, attributes: ['name'] },
                { model: ProductType, attributes: ['name', 'category'] },
                { model: Color, attributes: ['name'] },
                { model: Grade, attributes: ['name'] },
            ],
            order: orderCondition,
        });

        const loggedUser = req.session.user;

        if (loggedUser) {
            const user = await User.findOne({
                where: { username: loggedUser },
            });

            const favoriteProductIds = (
                await Favorite.findAll({
                    where: { userId: user.id },
                    attributes: ['productId'],
                })
            ).map((favorite) => favorite.productId);

            const productsWithFavorite = products.map((product) => ({
                ...product.toJSON(),
                favorite: favoriteProductIds.includes(product.id),
            }));

            res.status(200).json(productsWithFavorite);
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to search products.' });
    }
};
