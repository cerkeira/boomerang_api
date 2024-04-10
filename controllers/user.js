const User= require('../models/user')


const user = {

    find20(nameSearch){
        return User.find(nameSearch)
    }

}




module.exports = user;