const db= require('../db/index')


const product = {

    find(){
        return db.query('SELECT * FROM users');
    }

}




module.exports = product;