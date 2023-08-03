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
        });
    } else if (req.user.role === 'SpecialistHCP') {
        // Render SpecialistHCP's homepage
        return res.render('specialist/home', {
            header: {
                title: 'eyeConnect Portal - Home (Specialist HCP)'
                , scripts: [{ file: '/js/utils.js' }, { file: '/js/tableHandler.js' }]
            },
            navigation: Utils.Specialist.AuthorizedNavigation('Portal', 'Home'),
            awaitingConsultationsTable: {
                id:'awaitingCons',
                fetchOptions: {
                    url: Utils.Specialist.AwaitingConsultations.URL,
                    page: 1,
                    pageCount: 1,
                    limit: 5,
                    sort:{
                        sortBy: 'date',
                        asc: true,
                    },
                },
                fetchFunction: Utils.Specialist.AwaitingConsultations.FetchFunction,
                headerData: Utils.Specialist.AwaitingConsultations.TableHeaders,
                tableClasses: ['table', 'table-striped', 'caption-top', 'border', 'border-2', 'border-info'],
                caption: 'Exams awaiting consultations',
            },
            recentConsultationsTable:{
                id: 'recentCons',
                fetchOptions:{
                    url: Utils.Specialist.RecentConsultations.URL(req.user.id),
                    page: 1,
                    pageCount: 1,
                    limit: 5,
                    sort:{
                        sortBy: 'date',
                        asc: true,
                    }
                },
                fetchFunction: Utils.Specialist.RecentConsultations.FetchFunction,
                headerData: Utils.Specialist.RecentConsultations.TableHeaders,
                tableClasses: ['table', 'table-striped', 'caption-top', 'border', 'border-2', 'border-info'],
                caption: 'My recent consultations'

            }

        });
    } else {
        res.send("Medical Director roles is not implemented for MVP");
    }
}

module.exports = {
    home,
}