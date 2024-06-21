require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const config = require('config');

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.google_client_id || config.google_client_id,
            clientSecret:
                process.env.google_client_secret || config.google_client_secret,
            callbackURL: '/auth/google/callback',
        },
        (accessToken, refreshToken, profile, done) => {
            console.log('profile', profile);

            return done(null, profile);
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});
