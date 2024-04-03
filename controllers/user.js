const User= require('../models/user')


const user = {

    findAll(){
        return User.find()
    }

}




module.exports = user;