const Utils = require('./utils');
const home = async (req, res, next) => {
    if (req.user.validationStatus !== 'Validated') {
        return res.render('accountStatus', {
            header: { title: 'eyeConnect Portal - Account Inactive', },
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
        })
    }
    if (req.user.role === 'FieldHCP') {
        // Render FieldHCP's homepage
        return res.render('field/home', {
            header: {
                title: 'eyeConnect Portal - Home (Field HCP)',
                scripts: [
                    { file: '/js/tableComponent.js', },
                    { file: '/js/utils.js' }
                ]
            },
            navigation: Utils.Field.AuthorizedNavigation('Portal', 'Home'),
            trashIcon: Utils.Icons.TrashIcon,
            paperIcon: Utils.Icons.PaperIcon,
        });
    } else if (req.user.role === 'SpecialistHCP') {
        // Render SpecialistHCP's homepage
        return res.render('specialist/home', {
            header: {
                title: 'eyeConnect Portal - Home (Specialist HCP)'
                , scripts: [{ file: '/js/utils.js' }, { file: '/js/tableComponent.js' }]
            },
            navigation: Utils.Specialist.AuthorizedNavigation('Portal', 'Home'),
            paperIcon: Utils.Icons.PaperIcon,
            trashIcon: Utils.Icons.TrashIcon,
        });
    } else {
        res.send("Medical Director roles is not implemented for MVP");
    }
}

module.exports = {
    home,
}