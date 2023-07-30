const Utils = require('./utils')

const about = (req, res) => {
    let title, nav;
    if (req.user) {
        title = 'About eyeConnect';
        if (req.user.validationStatus !== 'Validated') {
            nav = {
                items: [{
                    text: 'About',
                    href: '#',
                    showInFooter: true,
                },
                {
                    text: 'Portal',
                    dropdown: [{
                        text: 'Home',
                        href: '/portal'
                    }]
                }],
                active: ['About']
            };
        } else {
            if (req.user.role === 'FieldHCP') {
                nav = Utils.Field.AuthorizedNavigation('About');
            } else {
                nav = Utils.Specialist.AuthorizedNavigation('About');
            }
        }

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
            active: ['Home'],
        };
    }
    res.render('about', {
        header: { title },
        navigation: nav,
    });
}

module.exports = about;