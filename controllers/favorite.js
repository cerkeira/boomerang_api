const Product = require('../models/product');
const Size = require('../models/size');
const ProductType = require('../models/productType');
const Color = require('../models/color');
const Grade = require('../models/grade');
const User = require('../models/user');
const Favorite = require('../models/favorite')


exports.getFavoriteProducts = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        const user = await User.findOne({ where: { username: loggedUser } });

        const favoriteProductIds = await Favorite.findAll({
            where: { userId: user.id },
            attributes: ['productId']
        });

        const productIds = favoriteProductIds.map((favorite) => favorite.productId);


        const favoriteProducts = await Product.findAll({
            where: { id: productIds },
            include: [
                { model: Size, attributes: ['name'] },
                { model: ProductType, attributes: ['name', 'category'] },
                { model: Color, attributes: ['name'] },
                { model: Grade, attributes: ['name'] },
            ]
        });
        
        const favoriteProductsData = favoriteProducts.map((product) => ({
            ...product.toJSON(),
            favorite: true 
        }));

        res.status(200).json(favoriteProductsData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch favorite products.' });
    }
};

exports.addToFavorites = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        const { productId } = req.body;

        const user = await User.findOne({ where: { username: loggedUser } });

        const existingFavorite = await Favorite.findOne({
            where: { userId: user.id, productId }
        });
        if (existingFavorite) {
            return res.status(400).json({ message: 'Product already in favorites' });
        }

        await Favorite.create({ userId: user.id, productId });

        res.status(201).json({ message: 'Product added to favorites successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to add product to favorites' });
    }
};


exports.removeFromFavorites = async (req, res) => {
    try {
        const loggedUser = req.session.user;
        if (!loggedUser) {
            return res.status(401).json({ message: 'User not found' });
        }

        const { productId } = req.body;

        const user = await User.findOne({ where: { username: loggedUser } });

        await Favorite.destroy({
            where: { userId: user.id, productId }
        });

        res.status(200).json({ message: 'Product removed from favorites successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to remove product from favorites' });
    }
};

