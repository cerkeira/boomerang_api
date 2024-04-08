const Product= require('../models/product')


const product = {

    findAll(){
        return Product.find()
    }

}




module.exports = product;