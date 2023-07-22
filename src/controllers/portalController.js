
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

const showSignUp = (req,res)=>{
    let agreedToPolicy = req.session.agreedToPolicy || false;
    res.render('signup',{
        header: {title: 'eyeConnect Portal - Sign-up'},
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

const showForgotPassword = (req,res) =>{
    res.render('forgotpass',{
        header: {title: 'eyeConnect Portal - Forgot Password'},
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
            active: null
        }
    });
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
}