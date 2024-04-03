const db= require('../db/index')


const user = {

    find(){
        return db.query('SELECT * FROM users');
    }

}




module.exports = user;