

const about = (req, res) => {
    let title, nav;
    if (req.user) {
        title = 'About eyeConnect';
        nav = {
            items: [{
                text: 'About',
                href: '#',
                showInFooter: true,
            },
            {
                text: 'Portal',
                dropdown: [{
                    text:'Home',
                    href: '/portal'
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
                showInFooter: true,
            },
            {
                text: 'Login',
                href: '/portal',
                showInFooter: true,
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