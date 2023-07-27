const Utils = require('../utils');
module.exports = (req, res, next) => {
    if (req.user.role === 'FieldHCP') {
        res.render('field/patients', {
            header: {
                title: 'eyeConnect Portal - Patients',
                scripts: [{ file: '/js/tableHandler.js' }, { file: '/js/utils.js' }]
            },
            navigation: Utils.Field.AuthorizedNavigation('Portal','Patients'),
            patientsTable:{
                id: 'allPatients',
                fetchOptions: {
                    url: Utils.Field.AllPatients.URL(),
                    page: 1,
                    pageCount: 0,
                    limit: 0,
                    sort: {
                        sortBy: 'latestExamDate',
                        asc: false,
                    },
                },
                fetchFunction: Utils.Field.AllPatients.FetchFunction,
                headerData: Utils.Field.AllPatients.TableHeaders,
                tableClasses: ['table', 'caption-top', 'border', 'border-2', 'border-info'],
                caption: 'All Patients',
            }
        });
    } else if (req.user.role === 'SpecialistHCP') {

    } else {

    }
}