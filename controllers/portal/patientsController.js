const Utils = require('../utils');
const index = (req, res, next) => {
    if (req.user.role === 'FieldHCP') {
        res.render('field/patients', {
            header: {
                title: 'eyeConnect Portal - Patients',
                scripts: [{ file: '/js/tableHandler.js' }, { file: '/js/utils.js' }]
            },
            navigation: Utils.Field.AuthorizedNavigation('Portal', 'Patients'),
            patientsTable: {
                id: 'allPatients',
                fetchOptions: {
                    url: Utils.Field.AllPatients.URL(),
                    page: 1,
                    limit: 10,
                    sort: {
                        sortBy: 'latestExamDate',
                        asc: false,
                    },
                },
                fetchFunction: Utils.Field.AllPatients.FetchFunction,
                headerData: Utils.Field.AllPatients.TableHeaders(req.user.role==='FieldHCP'),
                tableClasses: ['table', 'caption-top', 'border', 'border-2', 'border-info'],
                caption: 'All Patients',

            },
            plusIcon: Utils.Icons.PlusIcon,
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
                scripts: [{ file: '/js/utils.js' }, { file: '/js/tableHandler.js' }],
            },
            navigation,
            examsTable: {
                id: 'patientExams',
                fetchOptions: {
                    url: Utils.Field.AllExamsOfPatient.URL(req.params.id),
                    page: 1,
                    pageCount: 0,
                    limit: 5,
                    sort: {
                        sortBy: 'date',
                        asc: false,
                    },
                },
                fetchFunction: Utils.Field.AllExamsOfPatient.FetchFunction,
                headerData: Utils.Field.AllExamsOfPatient.TableHeaders,
                tableClasses: ['table', 'border', 'border-2', 'border-info'],
            },
            patientId: req.params.id,
            pencilIcon: Utils.Icons.PencilIcon,
            paperIcon: Utils.Icons.PaperIcon,
            eyeIcon: Utils.Icons.EyeIcon,
            saveIcon: Utils.Icons.CheckIcon,
            editMode: req.query?.edit==='true',

        });
    } else if (req.user.role === 'SpecialistHCP') {

    } else {

    }
}

module.exports = {
    index,
    details,
}