module.exports = class Utils {
    static Field = {
        AuthorizedNavigation: (...current) => ({
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
                },
                {
                    text: 'Patients',
                    href: '/portal/patients'
                },
                {
                    text: 'Exams',
                    href: '/portal/exams'
                }
                ]
            }],
            active: current,
        }),
        RecentPatients: {
            URL: id => `/portal/api/examinations?${id ? `filter=examiner._id&filterValue=${id}` : ''}`,
            FetchFunction: `(opts)=>{
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
                        const rows = [];
                        console.log(data);
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
            TableHeaders: [
                {
                    text: 'Name',
                    sort: {
                        sortBy: 'patient.name'
                    },
                },
                {
                    text: 'Age',
                    sort: { sortBy: 'patient.dateOfBirth' }
                }
            ],
        },
        AllPatients: {
            TableHeaders: [
                {
                    text: 'Name',
                    sort: { sortBy: 'name' },
                },
                {
                    text: 'Age',
                    sort: { sortBy: 'dateOfBirth' },
                },
                {
                    text: 'Gender',
                    sort: { sortBy: 'gender' },
                },
                {
                    text: 'Last Exam Date',
                    sort: { sortBy: 'latestExamDate' }
                },
                {
                    text: '# Exams',
                    sort: { sortBy: 'numExams' }
                }
            ],
            URL: ({ filterBy, filterValue } = {}) => `/portal/api/patients?includeLatestExamDate=true${(filterBy && filterValue) ? `&filterBy=${filterBy}=${filterValue}` : ''}`,
            FetchFunction: `(opts)=>{
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
                        const rows = [];
                        data.data.forEach(item => {
                            rows.push([item.name,calculateAge(item.dateOfBirth),item.gender,item.latestExamDate ? getDate(item.latestExamDate) : 'N/A' ,item.numExams],
                            );
                        });
                        opts.limit = data.limit ? data.limit : opts.limit;
                        opts.pageCount = data.pageCount ? data.pageCount : opts.pageCount;
                        opts.page = data.page ? data.page : opts.page;
                        res(rows);
                    });
                });
        }`
        },
        RecentExams: {
            URL: id => `/portal/api/examinations?${id ? `filter=examiner._id&filterValue=${id}` : ''}`,
            FetchFunction: `(opts)=>{
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
                    const rows = [];
                    data.data.forEach(item => {
                        rows.push([item.patient.name,getDate(item.date),item.hasConsultation ? 'yes' : 'no'],
                        );
                    });
                    opts.limit = data.limit ? data.limit : opts.limit;
                    opts.pageCount = data.pageCount ? data.pageCount : opts.pageCount;
                    opts.page = data.page ? data.page : opts.page;
                    res(rows);
                });
            });
    }`,
            TableHeaders: [
                {
                    text: 'Patient Name',
                    sort: {
                        sortBy: 'patient.name'
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
        },
        AllExams: {
            URL: id => `/portal/api/examinations?${id ? `filter=examiner._id&filterValue=${id}` : ''}`,
            TableHeaders: [
                {
                    text: 'Patient',
                    sort: { sortBy: 'patient.name' },
                },
                {
                    text: 'Exam Notes',
                },
                {
                    text: 'Exam Date',
                    sort: { sortBy: 'date' },
                },
                {
                    text: 'Consultation?',
                    sort: { sortBy: 'hasConsultation' },
                },
                {
                    text: 'Examiner',
                    sort: { sortBy: 'examiner.name' },
                },
                {
                    text: 'Image Count',
                    sort: { sortBy: 'numImages' },
                }
            ],
            FetchFunction: `(opts)=>{
                return new Promise((res,err)=>{
                    let fUrl = opts.url;
                    if(opts.sort?.sortBy){
                        fUrl += '&sortBy=' + opts.sort.sortBy + '&order=';
                        fUrl += opts.sort.asc ? 'ascending' : 'descending';
                        if(parseInt(opts.limit)>0){
                            fUrl += '&limit=' + parseInt(opts.limit);
                        }
                    }
                    maxNotesLength = 20;
                    fetch(fUrl)
                    .then(response => response.json())
                    .then(data => {
                        const rows = [];
                        data.data.forEach(item => {
                            rows.push([item.patient.name,item.notes.substring(0,Math.min(maxNotesLength,item.notes.length)) + '...', getDate(item.date), item.hasConsultation ? 'yes' : 'no', item.examiner.name, item.images ? item.images.length : 0 ]
                            );
                        });
                        opts.limit = data.limit ? data.limit : opts.limit;
                        opts.pageCount = data.pageCount ? data.pageCount : opts.pageCount;
                        opts.page = data.page ? data.page : opts.page;
                        res(rows);
                    });
                });
        }`,
        },


    };
}