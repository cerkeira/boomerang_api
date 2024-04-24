const Product = require('../models/product');
const Size = require('../models/size');
const ProductType = require('../models/productType');
const Color = require('../models/color');
const Grade = require('../models/grade');



exports.getProduct = async (req, res) => {
  try {
    const { id } = req.query;
    const product = await Product.findAll({
      where: {
        id: id, 
      },
      include: [
        { model: Size, attributes: ['name'] },
        { model: ProductType, attributes: ['name', 'category'] },
        { model: Color, attributes: ['name'] },
        { model: Grade, attributes: ['name'] }

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
        'GradeId'
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
      userId,
    } = req.body;

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
      UserId: userId,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to publish product.' });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.query;
    const product = await Product.destroy({
      where: {
        id: id, 
      },
      attributes: [
        'id'
      ],
    })


    res.status(200).json(product);
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
      date,
      availability,
      brand,
      sizeId,
      productTypeId,
      colorId,
      gradeId,
      userId,
    } = req.body;

    const existingProduct = await Product.findByPk(id);

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' });
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
      UserId: userId,
    });

    res.status(200).json(existingProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to edit product.' });
  }
};


exports.getForm = async (req, res) => {
  try {
    const sizes = await Size.findAll({
      attributes: [
        'id',
        'name'
      ],
    });
    const productTypes = await ProductType.findAll({
      attributes: [
        'id',
        'name',
        'category'
      ],
    });
    const colors = await Color.findAll({
      attributes: [
        'id',
        'name'
      ],
    });
    const grades = await Grade.findAll({
      attributes: [
        'id',
        'name'
      ],
    });

    res.status(200).json({
 sizes, productTypes, colors, grades 
});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch form data.' });
  }
};
