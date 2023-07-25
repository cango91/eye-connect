const home = async (req, res, next) => {
    if (req.user.validationStatus !== 'Validated') {
        return res.render('accountStatus', {
            header: { title: 'eyeConnect Portal - Account Inactive' },
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
            header: { title: 'eyeConnect Portal - Home (Field HCP)' },
            navigation: _buildFieldNav(),
            patientsTable: {
                id: 'patients',
                fetchOptions: {
                    url: '/portal/api/patients',
                    page: 1,
                    maxPage: 1,
                    limit: 0,
                    sort: {
                        sortBy: 'createdAt',
                        asc: true,
                    },
                },
                fetchFunction: `(opts)=>{
                    return new Promise((res,err)=>{
                        let fUrl = opts.url;
                        if(opts.sort?.sortBy){
                            fUrl += '?sortBy=' + opts.sort.sortBy + '&order=';
                            fUrl += opts.sort.asc ? 'ascending' : 'descending';
                        }
                        fetch(fUrl)
                        .then(response => response.json())
                        .then(data => {
                            const today = new Date();
                            const calculateAge = (dob) => today.getFullYear() - new Date(dob).getFullYear();
                            const rows = [];
                            data.forEach(item => {
                                rows.push([item.name, calculateAge(item.dateOfBirth)],
                                );
                            });
                            res(rows);
                        });
                    });
            }`,
            headerData:[
                {
                    text:'Name',
                    sort:{
                        sortBy:'name'
                    },
                    parseFunction: `(value,td) => {
                        return new Promise((res)=>{
                            td.innerText = 'loading';
                            setTimeout(()=>res(value),1000);
                        });
                    }`
                },
                {
                    text: 'Age',
                    sort:{sortBy: 'dateOfBirth'}
                }
            ]
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

const _buildPatientsTableComponent = (page = 1, itemsPerPage = 5) => {
    const table = {};
    table.page = page;
    table.itemsPerPage = itemsPerPage;
    table.totalPages = 10;
    table.id = 'patients',
        table.caption = 'All Patients',
        table.head = [
            {
                text: 'Name',
                sort: {
                    asc: {
                        href: `/portal/api/patients?sortBy=name&sort=ascending&limit=${itemsPerPage}`,
                    },
                    dsc: {
                        href: `/portal/api/patients?sortBy=name&sort=descending&limit=${itemsPerPage}`,
                    }
                }
            },
            {
                text: 'Age',
                sort: {
                    asc: {
                        href: `/portal/api/patients?sortBy=dateOfBirth&sort=descending&limit=${itemsPerPage}`
                    },
                    dsc: {
                        href: `/portal/api/patients?sortBy=dateOfBirth&sort=ascending&limit=${itemsPerPage}`
                    }
                }
            }
        ];
    table.dataUrl = '/portal/api/patients';
    table.parseFunction = `(data) => {
        const today = new Date();
        const calculateAge = (dob) => today.getFullYear() - new Date(dob).getFullYear();
        const rows = [];
        data.forEach(item => {
            rows.push({
                Name: item.name,
                Age: calculateAge(item.dateOfBirth),
            });
        });
        return rows;
    }`
    return table;
}

module.exports = {
    home,
}