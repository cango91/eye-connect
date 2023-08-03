const Utils = require('../utils');
const index = async (req, res, next) => {
    if (req.user.role === 'FieldHCP') {
        res.render('field/exams', {
            header: {
                title: 'eyeConnect Portal - Examinations',
                scripts: [{ file: '/js/utils.js' }, { file: '/js/tableComponent.js' }]
            },
            navigation: Utils.Field.AuthorizedNavigation('Portal', 'Exams'),
            trashIcon: Utils.Icons.TrashIcon,
        });
    } else if (req.user.role === 'SpecialistHCP') {

    } else {

    }
}

const newExam = (req, res, next) => {
    if (req.user.role === 'FieldHCP') {
        const navigation = Utils.Field.AuthorizedNavigation('New Exam');
        navigation.items.push({ text: 'New Exam', href: '#' });
        res.render('field/newExam', {
            header: {
                title: 'eyeConnect Portal - New Exam',
            },
            navigation,
            patientId: req.params.id,
        });
    } else if (req.user.role === 'SpecialistHCP') {
        const navigation = Utils.Specialist.AuthorizedNavigation('Error');
        navigation.items.push({ text: 'Error', href: '#' });
        res.render('genericError', {
            header: {
                title: 'eyeConnect Portal - Error',
                scripts: [{ file: '/js/utils.js' }],
            },
            navigation,
            error: {
                title: 'Not Authorized',
                message: 'Sorry, only Field HCPs are allowed to create exams'
            }
        }
        );
    } else {

    }
}
const details = (req, res, next) => {
    if (req.user.role === 'FieldHCP') {
        const navigation = Utils.Field.AuthorizedNavigation('View Exam');
        navigation.items.push({ text: 'View Exam', href: '#' });
        res.render('field/examDetails', {
            header: {
                title: 'eyeConnect Portal - Exam Details',
                scripts: [{ file: '/js/utils.js' }],
            },
            navigation,
            examId: req.params.id,
            saveIcon: Utils.Icons.SaveIcon,
            deleteIcon: Utils.Icons.TrashIcon,
            magnifyIcon: Utils.Icons.MagnifyIcon,
            uploadSingleIcon: Utils.Icons.UploadSingleIcon,
            uploadAllIcon: Utils.Icons.CheckAllIcon,
            removeAllIcon: Utils.Icons.CrossIcon,
            eyeIcon: Utils.Icons.EyeIcon,
            pencilIcon: Utils.Icons.PencilIcon,
            resultIcon: Utils.Icons.ImageIcon,
        });
    } else if (req.user.role === 'SpecialistHCP') {
        try {
            const navigation = Utils.Specialist.AuthorizedNavigation('View Exam');
            navigation.items.push({ text: 'View Exam', href: '#' });
            res.render('field/examDetails', {
                header: {
                    title: 'eyeConnect Portal - Exam Details',
                    scripts: [{ file: '/js/utils.js' }],
                },
                navigation,
                examId: req.params.id,
                saveIcon: Utils.Icons.SaveIcon,
                deleteIcon: Utils.Icons.TrashIcon,
                magnifyIcon: Utils.Icons.MagnifyIcon,
                uploadSingleIcon: Utils.Icons.UploadSingleIcon,
                uploadAllIcon: Utils.Icons.CheckAllIcon,
                removeAllIcon: Utils.Icons.CrossIcon,
                eyeIcon: Utils.Icons.EyeIcon,
                pencilIcon: Utils.Icons.PencilIcon,
                resultIcon: Utils.Icons.ImageIcon,
            });
        } catch (error) {
            res.redirect('genericError', {
                error: {
                    title: error.message,
                    message: process.env.NODE_ENV === 'dev' ? error : 'An unknown error has occured'
                }
            })
        }
    } else {
        res.redirect('/portal');
    }
}


module.exports = {
    index,
    new: newExam,
    details,
}