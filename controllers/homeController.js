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
            navigation: _buildFieldNav(),
            patientsTable: {
                id: 'myPatients',
                fetchOptions: {
                    url: '/portal/api/examinations?filter=examiner&filterValue=' + req.user.id,
                    page: 1,
                    pageCount: 0,
                    limit: 0,
                    sort: {
                        sortBy: 'updatedAt',
                        asc: false,
                    },
                },
                fetchFunction: `(opts)=>{
                                return new Promise((res,err)=>{
                                    let fUrl = opts.url;
                                    if(opts.sort?.sortBy){
                                        fUrl += '&sortBy=' + opts.sort.sortBy + '&order=';
                                        fUrl += opts.sort.asc ? 'ascending' : 'descending';
                                        if(parseInt(opts.limit)>0){
                                            fUrl += '&limit=' + parseInt(opts.limit);
                                        }
                                    }
                                    
                                    fetch(fUrl)
                                    .then(response => response.json())
                                    .then(data => {
                                        const today = new Date();
                                        const calculateAge = (dob) => today.getFullYear() - new Date(dob).getFullYear();
                                        const rows = [];
                                        data.data.forEach(item => {
                                            rows.push([item.patient.name, calculateAge(item.patient.dateOfBirth)],
                                            );
                                        });
                                        opts.limit = data.limit ? data.limit : opts.limit;
                                        opts.pageCount = data.pageCount ? data.pageCount : opts.pageCount;
                                        opts.page = data.page ? data.page : opts.page;
                                        res(rows);
                                    });
                                });
                        }`,
                headerData: [
                    {
                        text: 'Name',
                        sort: {
                            sortBy: 'name'
                        },
                    },
                    {
                        text: 'Age',
                        sort: { sortBy: 'dateOfBirth' }
                    }
                ],
                tableClasses: ['table', 'caption-top', 'border', 'border-2', 'border-info'],
                caption: 'My Recent Patients',
            },
            examsTable: {
                id: 'myExams',
                fetchOptions: {
                    url: '/portal/api/examinations?filter=examiner&filterValue=' + req.user.id,
                    page: 1,
                    pageCount: 0,
                    limit: 0,
                    sort: {
                        sortBy: 'updatedAt',
                        asc: false,
                    },
                },
                fetchFunction: `(opts)=>{
                                return new Promise((res,err)=>{
                                    let fUrl = opts.url;
                                    if(opts.sort?.sortBy){
                                        fUrl += '&sortBy=' + opts.sort.sortBy + '&order=';
                                        fUrl += opts.sort.asc ? 'ascending' : 'descending';
                                        if(parseInt(opts.limit)>0){
                                            fUrl += '&limit=' + parseInt(opts.limit);
                                        }
                                    }
                                    
                                    fetch(fUrl)
                                    .then(response => response.json())
                                    .then(data => {
                                        const today = new Date();
                                        const calculateAge = (dob) => today.getFullYear() - new Date(dob).getFullYear();
                                        const rows = [];
                                        data.data.forEach(item => {
                                            rows.push([item.patient.name,getDate(item.date),item.consultations?.length ? 'yes' : 'no'],
                                            );
                                        });
                                        opts.limit = data.limit ? data.limit : opts.limit;
                                        opts.pageCount = data.pageCount ? data.pageCount : opts.pageCount;
                                        opts.page = data.page ? data.page : opts.page;
                                        res(rows);
                                    });
                                });
                        }`,
                headerData: [
                    {
                        text: 'Patient Name',
                        sort: {
                            sortBy: 'name'
                        },
                    },
                    {
                        text: 'Exam Date',
                        sort: {
                            sortBy: 'date'
                        }
                    },
                    {
                        text: 'Consultation?'
                    },

                ],
                tableClasses: ['table', 'caption-top', 'border', 'border-2', 'border-info'],
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

const _buildFieldNav = () => {
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