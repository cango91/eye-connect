

const about = (req, res) => {
    let title, nav;
    if (req.user) {
        title = 'About eyeConnect';
        nav = {
            items: [{
                text: 'About',
                href: '#',
            },
            {
                text: 'Portal',
                dropdown: [{
                    text:'Home',
                    href: '/portal/home'
                }]
            }],
            active: 'About'
        };
    } else {
        title = 'eyeConnect'
        nav = {
            items: [{
                text: 'Home',
                href: '#',
            },
            {
                text: 'Login',
                href: '/portal',
            }],
            active: 'Home',
        };
    }
    res.render('about', {
        header: { title },
        navigation: nav,
    });
}

module.exports = about;