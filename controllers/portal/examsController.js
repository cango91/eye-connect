const { create } = require('../../models/user');
const Utils = require('../utils');
const index = async (req, res, next) => {
    if (req.user.role === 'FieldHCP') {
        res.render('field/exams', {
            header: {
                title: 'eyeConnect Portal - Examinations',
                scripts: [{ file: '/js/utils.js' }, { file: '/js/tableHandler.js' }]
            },
            navigation: Utils.Field.AuthorizedNavigation('Portal','Exams'),
            examsTable:{
                id: 'exams',
                caption: 'All Examinations',
                fetchOptions: {
                    url: Utils.Field.AllExams.URL(),
                    page: 1,
                    pageCount: 0,
                    limit: 10,
                    sort: {
                        sortBy: 'updatedAt',
                        asc: false,
                    },
                },
                fetchFunction: Utils.Field.AllExams.FetchFunction,
                headerData: Utils.Field.AllExams.TableHeaders,
                tableClasses: ['table', 'table-striped', 'caption-top', 'border', 'border-2', 'border-info'],
            }
        });
    } else if (req.user.role === 'SpecialistHCP') {

    } else {

    }
}

const newExam = (req,res,next) =>{
    if (req.user.role === 'FieldHCP') {
        const navigation = Utils.Field.AuthorizedNavigation('New Exam');
        navigation.items.push({text:'New Exam',href: '#'});
        res.render('field/newExam', {
            header: {
                title: 'eyeConnect Portal - New Exam',
            },
            navigation,
            patientId: req.params.id,
        });
    } else if (req.user.role === 'SpecialistHCP') {

    } else {

    }
}
const details = (req,res,next) =>{
    if (req.user.role === 'FieldHCP') {
        const navigation = Utils.Field.AuthorizedNavigation('View Exam');
        navigation.items.push({text:'View Exam',href: '#'});
        res.render('field/examDetails', {
            header: {
                title: 'eyeConnect Portal - Exam Details',
                scripts: [{file:'/js/utils.js'}],
            },
            navigation,
            examId: req.params.id,
            saveIcon: Utils.Icons.SaveIcon,
            deleteIcon: Utils.Icons.TrashIcon,
            magnifyIcon: Utils.Icons.MagnifyIcon,
            uploadSingleIcon: Utils.Icons.UploadSingleIcon,
            uploadAllIcon: Utils.Icons.CheckAllIcon,
            removeAllIcon: Utils.Icons.CrossIcon,
        });
    } else if (req.user.role === 'SpecialistHCP') {
        const navigation = Utils.Specialist.AuthorizedNavigation('View Exam');
        navigation.items.push({text:'View Exam',href: '#'});
        res.render('field/examDetails', {
            header: {
                title: 'eyeConnect Portal - Exam Details',
                scripts: [{file:'/js/utils.js'}],
            },
            navigation,
            examId: req.params.id,
            saveIcon: Utils.Icons.SaveIcon,
            deleteIcon: Utils.Icons.TrashIcon,
            magnifyIcon: Utils.Icons.MagnifyIcon,
            uploadSingleIcon: Utils.Icons.UploadSingleIcon,
            uploadAllIcon: Utils.Icons.CheckAllIcon,
            removeAllIcon: Utils.Icons.CrossIcon,
        });
    } else {
        res.redirect('/portal');
    }
}


module.exports = {
    index,
    new:newExam,
    details,
}