const usersService = require('../services/usersService');
const AuthenticateService = require('../services/authenticationService');
const authenticate = new AuthenticateService(usersService);

const showLogIn = (req, res) => {
    let agreedToPolicy = req.session.agreedToPolicy || false;
    res.render('login', {
        header: { title: 'eyeConnect Portal - Login' },
        showPolicyPopup: !agreedToPolicy,
        navigation: {
            items: [
                {
                    text: 'Home',
                    href: '/',
                    showInFooter: true,
                },
                {
                    text: 'Login',
                    href: '#',
                    showInFooter: true,
                },
            ],
            active: 'Login'
        }
    });
}

const showSignUp = (req, res, next) => {
    let agreedToPolicy = req.session.agreedToPolicy || false;
    if (req.isAuthenticated()) {
        if (req.user.validationStatus === 'Incomplete') {
            return res.render('completeSignup', {
                header: { title: 'eyeConnect Portal - Complete Sign-up' },
                navigation: {
                    items: [
                        {
                            text: 'About',
                            href: '/about',
                            showInFooter: true,
                        },
                        {
                            text: 'Account Validation',
                            href: '#',
                            showInFooter: false,
                        }
                    ],
                    active: 'Account Validation'
                }
            });
        } else {
            return res.redirect('/portal/home');
        }
    }
    res.render('signup', {
        header: { title: 'eyeConnect Portal - Sign-up' },
        showPolicyPopup: !agreedToPolicy,
        navigation: {
            items: [
                {
                    text: 'Home',
                    href: '/',
                    showInFooter: true,
                },
                {
                    text: 'Login',
                    href: '#',
                    showInFooter: true,
                },
            ],
            active: ''
        }
    });
}

const showForgotPassword = (req, res) => {
    res.render('forgotpass', {
        header: { title: 'eyeConnect Portal - Forgot Password' },
        navigation: {
            items: [
                {
                    text: 'Home',
                    href: '/',
                    showInFooter: true,
                },
                {
                    text: 'Login',
                    href: '/portal',
                    showInFooter: true,
                },
            ],
            active: ''
        }
    });
}

const signUp = async (req, res, next) => {
    try {
        if (req.isAuthenticated()) res.redirect('/portal/home');
        if (!req.session.agreedToPolicy) throw new Error('User must agree to sign-up ONLY if they are a certified HCP and agree to privacy policy and ToS');
        authenticate.authenticateSignup((err, user, info, status) => {
            if (status === 400) {
                err = { name: status, message: info.message };
            }
            if (err) {
                res.render('signupError', _buildSignupError([err]));
                return;
            }
            if (!user) {
                res.render('signupError', _buildSignupError([{ name: "SignUpError", message: "User could not be created." }]));
                return;
            }
            req.logIn(user, err => {
                if (err) {
                    res.render('signupError', _buildSignupError([err]));
                    return;
                }
                return res.redirect('/portal/signup');
            });


        })(req, res, next);
    } catch (err) {
        res.render('signupError', _buildSignupError([err]));
    }
}

const _buildSignupError = errors => {
    return {
        header: { title: 'eyeConnect Portal - ERROR' },
        navigation: {
            items: [
                {
                    text: 'Home',
                    href: '/',
                    showInFooter: true,
                },
                {
                    text: 'Login',
                    href: '/portal',
                    showInFooter: true,
                },
            ],
            active: ''
        },
        errors: errors,
    };
}

const oAuthCallback = (req, res, next) => {
    if (req.isAuthenticated()) res.redirect('/portal/home');
    if (!req.session.agreedToPolicy) throw new Error('User must agree to sign-up ONLY if they are a certified HCP and agree to privacy policy and ToS');
    try {
        authenticate.authenticateLogin((err, user, info, status) => {
            if (status === 400) {
                err = { name: status, message: info.message };
            }
            if (err) {
                res.render('signupError', _buildSignupError([err]));
                return;
            }
            if (!user) {
                res.render('signupError', _buildSignupError([{ name: "SignUpError", message: "User could not be created." }]));
                return;
            }
            req.logIn(user, err => {
                if (err) {
                    res.render('signupError', _buildSignupError([err]));
                    return;
                }
                return res.redirect('/portal/signup');
            });
        })(req, res, next);
    } catch (err) {
        console.log(err);
        res.render('signupError', _buildSignupError([err]));
    }
}

const login = (req, res, next) => {
    if (req.isAuthenticated()) return res.redirect('/portal/home');
    authenticate.authenticateLogin((err, user, info, status) => {
        if (status === 400) {
            err = { name: status, message: info.message };
        }
        if (err) {
            const obj = _buildSignupError([err]);
            obj.header.title = 'eyeConnect Portal - ERROR logging in';
            return res.render('loginError', obj);
        }
        if (!user) {
            const obj = _buildSignupError([{ name: 'Login Error', message: 'User not found!' }]);
            obj.header.title = 'eyeConnect Portal - ERROR logging in';
            return res.render('loginError', obj);
        }
        req.logIn(user, err => {
            if (err) {
                const obj = _buildSignupError([err]);
                obj.header.title = 'eyeConnect Portal - ERROR logging in';
                res.render('loginError', _buildSignupError([obj]));
                return;
            }
            return res.redirect('/portal');
        });

    })(req, res, next);
}

const logout = (req, res, next) => {
    req.logout(() => {
        res.redirect('/');
    })
}

const agreeToPolicy = (req, res) => {
    req.session.agreedToPolicy = true;
    let returnTo = req.query.returnTo || '/portal/login';
    res.json({ redirect: returnTo });
}

const rejectPolicy = (req, res) => {
    if (req.user) {
        req.logout(() => {
            req.session.agreedToPolicy = false;
            res.json({ redirect: '/' });
        });
    }
    req.session.regenerate(err => {
        if (err) {
            console.error(err);
        }
        req.session.agreedToPolicy = false;
        res.json({ redirect: '/' });
    });
}

module.exports = {
    showLogIn,
    agreeToPolicy,
    rejectPolicy,
    showForgotPassword,
    showSignUp,
    signUp,
    oAuthCallback,
    login,
    logout,
}