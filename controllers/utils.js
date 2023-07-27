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
                },
                {
                    text: '',
                    parseFunction: `(val,td) => new Promise(res => {
                        roles = ['new exam','view patient','edit patient']
                        const svgs = ['<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="i i-add-exam" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/> <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/> <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/> </svg>', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="i i-view-patient" viewBox="0 0 16 16"> <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/> <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/> </svg>', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="i i-edit-patient" viewBox="0 0 16 16"> <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/> </svg>'];
                        const classes = ['btn btn-primary ms-1','btn btn-secondary ms-1','btn btn-success ms-1'];
                        const hrefs = ['/portals/patients/'+val+'/exams/new','/portal/patients/'+val,'/portal/patients/'+val+'/edit'];
                        for(let i = 0; i<svgs.length; i++){
                            const a = document.createElement('a');
                            a.href = hrefs[i];
                            a.className = classes[i];
                            a.innerHTML = svgs[i];
                            td.appendChild(a);
                        }
                        res();
                    })`,
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
                            rows.push([item.name,calculateAge(item.dateOfBirth),item.gender,item.latestExamDate ? getDate(item.latestExamDate) : 'N/A' ,item.numExams, item._id],
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