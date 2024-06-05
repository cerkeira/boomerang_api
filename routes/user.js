const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const { check } = require('express-validator');
const upload = require('../db/middleware/multerConfig');

router.get('/', userController.getUser);

router.get('/search', userController.searchUsersByUsername);

router.post(
    '/register',
    upload.single('profileImage'),
    [
        check('username').notEmpty().withMessage('Username is required'),
        check('name').notEmpty().withMessage('Name is required'),
        check('email').isEmail().withMessage('Invalid email'),
        check('password')
            .isLength({ min: 5 })
            .withMessage('Password must be at least 5 characters long'),
    ],
    userController.registerUser
);

router.post('/login', userController.loginUser);

router.post('/logout', userController.logoutUser);

router.delete('/', userController.deleteUser);

router.put('/', userController.editUser);

router.put('/password', userController.editPassword);

module.exports = router;
