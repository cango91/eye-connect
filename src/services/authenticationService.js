// Wraps passport.js to provide some decoupling for authentication.
// Rest of the app doesn't directly depend on passport.js
// Provides a singleton implementation to ensure strategies are only configured once
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local').Strategy;

let instance = null;

module.exports = class AuthenticateService {
    constructor(usersService) {
        if (!instance) {
            instance = this;
            this.usersService = usersService;

            passport.use(new GoogleStrategy({
                clientID: process.env.OAUTH_GOOGLE_CLIENT_ID,
                clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
                callbackURL: process.env.OAUTH_GOOGLE_CALLBACK,
                scope: ['profile', 'email'],
                prompt: 'select_account',
            },
                async (accessToken, refreshToken, profile, cb) => {
                    try {
                        let user = await this.usersService.getUserByGoogleId(profile.id);
                        if (user) return cb(null, user);
                        if (this.usersService.isEmailUnique(profile.emails[0].value)) {
                            user = await this.usersService.initialOAuthSignUp({
                                googleId: profile.id,
                                email: profile.emails[0].value,
                                displayName: profile.displayName,
                            });
                            return cb(null, user);
                        } else {
                            return cb(new Error('Email already registered'), false);
                        }
                    } catch (err) {
                        return cb(err, false);
                    }
                }));

            passport.use('local-login', new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
            },
                async (email, password, cb) => {
                    try {
                        const user = await this.usersService.getUserByEmail(email);
                        if (!user) throw new Error('User not found');
                        return cb(null, await this.usersService.verifyUser(user, password) ? user : false);
                    } catch (err) {
                        return cb(err);
                    }
                }));
            passport.use('local-signup', new LocalStrategy({
                usernameField: 'email',
                passwordField: 'password',
                passReqToCallback: true,
            },
                async (req, email, password, cb) => {
                    try {
                        const newUser = await usersService.initialLocalSignUp(req.body);
                        if (newUser) {
                            return cb(null, newUser);
                        }
                        throw new Error('Unknown error occured at local-signup');
                    } catch (err) {
                        return cb(err);
                    }
                }));

            passport.serializeUser((user, cb) => {
                cb(null, user._id);
            });

            passport.deserializeUser(async (id, cb) => {
                const user = await usersService.getUserById(id);
                if (!user) {
                    cb(new Error('user not found'));
                }
                cb(null, user);
            });
        }

        return instance;
    }
    initialize() {
        return passport.initialize();
    }

    session() {
        return passport.session();
    }

    authenticateSignup(cb) {
        const defaultCb = (err, user, info) => {
            if (err) throw err;
            if (!user) throw new Error(info.message);
        }
        return passport.authenticate('local-signup', cb || defaultCb);
    }

    authenticateLogin(cb) {
        const defaultCb = (err, user, info) => {
            if (err) throw err;
            if (!user) throw new Error(info.message);
        }
        return passport.authenticate(['local-login', 'google'], cb || defaultCb);
    }

    authenticate = (req, res, next) => {
        try {
            if (req.isAuthenticated()) return next();
            return res.redirect('/portal/login');
        } catch (err) {
            console.error(err);
        }
    }
}