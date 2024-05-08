const express = require('express');

const router = express.Router();
const userController = require('../controllers/user');

router.get('/', userController.getUser);

router.get('/search', userController.searchUsersByUsername);

router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

router.post('/logout', userController.logoutUser);

router.delete('/', userController.deleteUser);

router.put('/', userController.editUser);

router.put('/password', userController.editPassword);

module.exports = router;
