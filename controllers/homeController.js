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
                    { file: '/js/tableHandler.js', },
                    { file: '/js/utils.js' }
                ]
            },
            navigation: Utils.Field.AuthorizedNavigation('Portal','Home'),
            patientsTable: {
                id: 'myPatients',
                fetchOptions: {
                    url: Utils.Field.RecentExams.URL(req.user.id),
                    page: 1,
                    pageCount: 0,
                    limit: 0,
                    sort: {
                        sortBy: 'updatedAt',
                        asc: false,
                    },
                },
                fetchFunction: Utils.Field.RecentPatients.FetchFunction,
                headerData: Utils.Field.RecentPatients.TableHeaders,
                tableClasses: ['table', 'table-striped', 'caption-top', 'border', 'border-2', 'border-info'],
                caption: 'My Recent Patients',
            },
            examsTable: {
                id: 'myExams',
                fetchOptions: {
                    url: Utils.Field.RecentExams.URL(req.user.id),
                    page: 1,
                    pageCount: 0,
                    limit: 0,
                    sort: {
                        sortBy: 'updatedAt',
                        asc: false,
                    },
                },
                fetchFunction: Utils.Field.RecentExams.FetchFunction,
                headerData: Utils.Field.RecentExams.TableHeaders,
                tableClasses: ['table', 'table-striped', 'caption-top', 'border', 'border-2', 'border-info'],
                caption: 'My Recent Exams',
            },

        });
    } else if (req.user.role === 'SpecialistHCP') {
        // Render SpecialistHCP's homepage
        return res.render('specialist/home', {
            header: { title: 'eyeConnect Portal - Home (Specialist HCP)' },
            navigation: _buildSpecialistNav(),
        });
    } else {
        res.send("Medical Director roles is not implemented for MVP");
    }
}

const _buildSpecialistNav = () => {
    return {
        items: [{
            text: 'About',
            href: '/about',
            showInFooter: true,
        },
        {
            text: 'Portal',
            dropdown: [{
                text: 'Home',
                href: '/portal'
            }]
        }],
        active: 'Home'
    };
}

module.exports = {
    home,
}