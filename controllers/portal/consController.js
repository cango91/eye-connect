const Utils = require('../utils');

const newCons = (req, res, next) => {
    if (req.user.role === 'SpecialistHCP') {
        const navigation = Utils.Specialist.AuthorizedNavigation('New Consultation');
        navigation.items.push({ text: 'New Consultation', href: '#' });
        res.render('specialist/newCons', {
            header: {
                title: 'eyeConnect Portal - New Consultation',
                scripts: [{ file: '/js/utils.js' }],
            },
            navigation,
            examId: req.params.id,
        });
    } else if (req.user.role === 'FieldHCP') {
        const navigation = Utils.Field.AuthorizedNavigation('Error');
        navigation.items.push({ text: 'Error', href: '#' });
        res.render('genericError', {
            header: {
                title: 'eyeConnect Portal - Error',
            },
            navigation,
            error: {
                title: 'Not Authorized',
                message: 'Sorry, only Specialist HCPs are allowed to create consultations'
            }
        }
        );
    } else {

    }
}

const details = (req, res, next) => {
    let navigation;
    if (req.user.role === 'FieldHCP') {
        navigation = Utils.Field.AuthorizedNavigation('Consultation Details');
    } else {
        navigation = Utils.Specialist.AuthorizedNavigation('Consultation Details');
    }
    navigation.items.push({ text: 'Consultation Details', href: '#' });

    res.render('specialist/consDetails', {
        header: {
            title: 'eyeConnect Portal - Consultation Details',
            scripts: [{ file: '/js/utils.js' }]
        },
        navigation,
        examId: req.params.id,
        saveIcon: Utils.Icons.SaveIcon,
        deleteIcon: Utils.Icons.TrashIcon,
        magnifyIcon: Utils.Icons.MagnifyIcon,
    });
}

const getOne = (req,res,next) =>{
    if(req.user.role === 'FieldHCP'){
        const navigation = Utils.Field.AuthorizedNavigation('Error');
        navigation.items.push({ text: 'Error', href: '#' });
        res.status(403);
        res.render('genericError',{
            error: {
                title: 'Unauthorized',
                message: 'You are not authorized to view consultations by id'
            },
            navigation,
        });
    }else{
        const navigation = Utils.Specialist.AuthorizedNavigation('Consultation Details');
        navigation.items.push({ text: 'Consultation Details', href: '#' });
        res.render('specialist/showCons', {
            header: {
                title: 'eyeConnect Portal - Consultation Details',
                scripts: [{ file: '/js/utils.js' }]
            },
            navigation,
            consId: req.params.id,
            saveIcon: Utils.Icons.SaveIcon,
            deleteIcon: Utils.Icons.TrashIcon,
            magnifyIcon: Utils.Icons.MagnifyIcon,
            resultIcon: Utils.Icons.ImageIcon,
        });
    }
}

module.exports = {
    new: newCons,
    details,
    getOne,
}