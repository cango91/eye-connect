const Utils = require('../utils');
module.exports = async (req, res, next) => {
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
                    limit: 0,
                    sort: {
                        sortBy: 'updatedAt',
                        asc: false,
                    },
                },
                fetchFunction: Utils.Field.AllExams.FetchFunction,
                headerData: Utils.Field.AllExams.TableHeaders,
                tableClasses: ['table', 'caption-top', 'border', 'border-2', 'border-info'],
            }
        });
    } else if (req.user.role === 'SpecialistHCP') {

    } else {

    }
}