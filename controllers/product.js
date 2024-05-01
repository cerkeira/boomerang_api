const Product = require('../models/product')
const Size = require('../models/size')
const ProductType = require('../models/productType')
const Color = require('../models/color')
const Grade = require('../models/grade')
const User = require('../models/user')

exports.getProduct = async (req, res) => {
    try {
        const { id } = req.query
        const product = await Product.findAll({
            where: {
                id: id,
            },
            include: [
                { model: Size, attributes: ['name'] },
                { model: ProductType, attributes: ['name', 'category'] },
                { model: Color, attributes: ['name'] },
                { model: Grade, attributes: ['name'] },
            ],
            attributes: [
                'title',
                'description',
                'measurements',
                'value',
                'price_day',
                'date',
                'availability',
                'brand',
                'ProductTypeId',
                'ColorId',
                'SizeId',
                'UserId',
                'GradeId',
            ],
        })

        res.status(200).json(product)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to fetch product.' })
    }
}

exports.publishProduct = async (req, res) => {
    try {
        const loggedUser = req.session.user
        if (!loggedUser) {
            return res.status(403).json({ message: 'User not found' })
        }
        const user = await User.findOne({ where: { username: loggedUser } })

        const {
            title,
            description,
            measurements,
            value,
            price_day,
            date,
            availability,
            brand,
            sizeId,
            productTypeId,
            colorId,
            gradeId,
        } = req.body

        const newProduct = await Product.create({
            title,
            description,
            measurements,
            value,
            price_day,
            date,
            availability,
            brand,
            SizeId: sizeId,
            ProductTypeId: productTypeId,
            ColorId: colorId,
            GradeId: gradeId,
            UserId: user.id,
        })

        res.status(201).json(newProduct)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to publish product.' })
    }
}

exports.deleteProduct = async (req, res) => {
    try {
        const loggedUser = req.session.user

        const { id } = req.query

        const existingProduct = await Product.findByPk(id)

        if (!loggedUser) {
            return res.status(403).json({ message: 'User not found' })
        }
        const user = await User.findOne({ where: { username: loggedUser } })

        if (existingProduct.UserId != user.id) {
            return res
                .status(403)
                .json({ message: `${user} can't delete ${existingProduct}` })
        }

        await Product.destroy({
            where: {
                id: id,
            },
            attributes: ['id'],
        })

        res.status(200).json({ message: 'Product deleted successfully.' })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to delete product.' })
    }
}

exports.editProduct = async (req, res) => {
    try {
        const {
            id,
            title,
            description,
            measurements,
            value,
            price_day,
            date,
            availability,
            brand,
            sizeId,
            productTypeId,
            colorId,
            gradeId,
        } = req.body

        const loggedUser = req.session.user

        const existingProduct = await Product.findByPk(id)

        if (!existingProduct) {
            return res.status(404).json({ message: 'Product not found.' })
        }

        if (!loggedUser) {
            return res.status(403).json({ message: 'User not found' })
        }
        const user = await User.findOne({ where: { username: loggedUser } })

        if (existingProduct.UserId != user.id) {
            return res
                .status(403)
                .json({ message: `${user} can't edit ${existingProduct}` })
        }

        await existingProduct.update({
            title,
            description,
            measurements,
            value,
            price_day,
            date,
            availability,
            brand,
            SizeId: sizeId,
            ProductTypeId: productTypeId,
            ColorId: colorId,
            GradeId: gradeId,
        })

        res.status(200).json(existingProduct)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to edit product.' })
    }
}

exports.getForm = async (req, res) => {
    try {
        const loggedUser = req.session.user
        if (!loggedUser) {
            return res.status(403).json({ message: 'User not logged in.' })
        }

        const sizes = await Size.findAll({
            attributes: ['id', 'name'],
        })
        const productTypes = await ProductType.findAll({
            attributes: ['id', 'name', 'category'],
        })
        const colors = await Color.findAll({
            attributes: ['id', 'name'],
        })
        const grades = await Grade.findAll({
            attributes: ['id', 'name'],
        })

        res.status(200).json({
            sizes,
            productTypes,
            colors,
            grades,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Failed to fetch form data.' })
    }
}
