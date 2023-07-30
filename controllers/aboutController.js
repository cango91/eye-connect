
const Utils = require('./utils');
const about = (req, res) => {
    let title, nav;
    if (req.user) {
        title = 'About eyeConnect';
        if(req.user.validationStatus!=='Validated'){
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
            active: ['About']
        };
    }else{
        nav = Utils.Field.AuthorizedNavigation('About');
    }
    } else {
        title = 'eyeConnect'
    }
    res.render('about', {
        header: { title },
        navigation: Utils.Specialist.AuthorizedNavigation('About'),
    });
}

module.exports = about;