const passport = require('passport');

exports.googleAuth = passport.authenticate('google', {
    scope: ['profile', 'email'],
});

exports.googleAuthCallback = passport.authenticate('google', {
    failureRedirect: '/',
});

exports.googleAuthCallbackRedirect = (req, res) => {
    res.redirect('/profile');
};

exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Error during logout:', err);
        }
        res.redirect('/');
    });
};
