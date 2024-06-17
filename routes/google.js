const express = require('express');
const router = express.Router();

const googleController = require('../controllers/googleController');

router.get('/google', googleController.googleAuth);

router.get(
    '/google/callback',
    authController.googleAuthCallback,
    authController.googleAuthCallbackRedirect
);

router.get('/logout', googleController.logout);

module.exports = router;
