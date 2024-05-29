const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const process = require('process');
const envIndex = process.argv.indexOf('--env');
const env =
    envIndex !== -1 && process.argv[envIndex + 1]
        ? process.argv[envIndex + 1]
        : 'production';
const config = require(`${__dirname}/../config/config.json`)[env];

passport.use(
    new GoogleStrategy(
        {
            clientID: config.google_client_id,
            clientSecret: config.google_client_secret,
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
