const express = require('express');
const router = express.Router();
const googleController = require('../controllers/googleController');

router.get('/', (req, res) => {
    res.send('<a href="/auth/google">Sign in with Google</a>');
});

router.get('/auth', googleController.googleAuth);

router.get(
    '/auth/callback',
    googleController.googleAuthCallback,
    googleController.googleAuthCallbackRedirect
);

router.get('/logout', googleController.logout);

module.exports = router;
