const express = require('express')

const router = express.Router()
const userController = require('../controllers/user')

// router.get('/', userController.getAllUsers);

router.get('/', userController.getUser)

router.get('/search', userController.searchUsersByUsername)

router.post('/register', userController.registerUser)

router.post('/login', userController.loginUser)

router.post('/logout', userController.logoutUser)

router.delete('/', userController.deleteUser)

router.put('/edituser', userController.editUser)

router.put('/editpassword', userController.editPassword)

router.put('/editlocation', userController.editLocation)

router.get('/locations', userController.listUserLocations)

module.exports = router
