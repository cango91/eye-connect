const Utils = require('../utils');
const index = (req, res, next) => {
    if (req.user.role === 'FieldHCP') {
        res.render('field/patients', {
            header: {
                title: 'eyeConnect Portal - Patients',
                scripts: [{ file: '/js/tableComponent.js' }, { file: '/js/utils.js' }]
            },
            navigation: Utils.Field.AuthorizedNavigation('Portal', 'Patients'),
            trashIcon: Utils.Icons.TrashIcon,
            paperIcon: Utils.Icons.PaperIcon,
            pencilIcon: Utils.Icons.PencilIcon,
            plusIcon: Utils.Icons.PlusIcon2,
        });
    } else if (req.user.role === 'SpecialistHCP') {

    } else {

    }
}

const details = (req, res, next) => {
    if (req.user.role === 'FieldHCP') {
        const navigation = Utils.Field.AuthorizedNavigation('Patient Details');
        navigation.items.push({text: 'Patient Details', href:"#"});
        res.render('field/patientDetails', {
            header: {
                title: 'eyeConnect Portal - Patient Details',
                scripts: [{ file: '/js/utils.js' }, { file: '/js/tableComponent.js' }],
            },
            navigation,
            patientId: req.params.id,
            pencilIcon: Utils.Icons.PencilIcon,
            paperIcon: Utils.Icons.PaperIcon,
            eyeIcon: Utils.Icons.EyeIcon,
            saveIcon: Utils.Icons.CheckIcon,
            trashIcon: Utils.Icons.TrashIcon,
            editMode: req.query?.edit==='true',

        });
    } else if (req.user.role === 'SpecialistHCP') {

    } else {

    }
}

const newPatient = (req, res, next) => {
    if (req.user.role === 'FieldHCP') {
        const navigation = Utils.Field.AuthorizedNavigation('New Patient');
        navigation.items.push({text: 'New Patient', href:"#"});
        res.render('field/newPatient', {
            header: {
                title: 'eyeConnect Portal - New Patient',
                scripts: [{ file: '/js/utils.js' }],
            },
            navigation,
            paperIcon: Utils.Icons.PaperIcon,
            saveIcon: Utils.Icons.CheckIcon,
            cancelIcon: Utils.Icons.CrossIcon,
            prefillName: req.query?.name

        });
    } else if (req.user.role === 'SpecialistHCP') {

    } else {

    }
}

module.exports = {
    index,
    details,
    new:newPatient,

}