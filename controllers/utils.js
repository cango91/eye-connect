module.exports = class Utils {
    static Icons = {
        EyeIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="i i-view-patient" viewBox="0 0 16 16"> <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/> <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/> </svg>`,
        PaperIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="i i-add-exam" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/> <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/> <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/> </svg>`,
        PencilIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="i i-edit-patient" viewBox="0 0 16 16"> <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/> </svg>`,
        TrashIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="i i-delete" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg>`,
        CheckIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="i i-save" viewBox="0 0 16 16"> <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/> </svg>`,
        PlusIcon: `<svg class="my-auto" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/> </svg>`,
        CrossIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16"> <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/> </svg>`,
    }

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
                            fUrl += '&limit=' + parseInt(opts.limit) + '&page=' + parseInt(opts.page);
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
            TableHeaders: (allowDelete=false) => [
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
                    parseFunction: `(data,td) => new Promise(res => {
                        const svgs = ['${Utils.Icons.PaperIcon}', '${Utils.Icons.EyeIcon}', '${Utils.Icons.PencilIcon}'];
                        let {id, name} = data;
                        const val = id
                        const classes = ['btn btn-primary collapse-btn-icon','btn btn-info collapse-btn-icon','btn btn-warning collapse-btn-icon'];
                        const hrefs = ['/portal/patients/'+val+'/exams/new','/portal/patients/'+val,'/portal/patients/'+val+'?edit=true'];
                        ${!allowDelete ? '' : 
                        `svgs.push('${Utils.Icons.TrashIcon}');
                        hrefs.push(val);
                        classes.push('btn btn-danger collapse-btn-icon');
                        const showModal = (id, name) =>{
                            const modalDiv = document.getElementById('deleteModal')
                            const modal = new bootstrap.Modal(modalDiv);
                            const deleteButton = document.getElementById('confirmDeleteBtn');
                            const deleteContent = document.querySelector('.modal-body');
                            const deleteTitle = document.getElementById('deleteModalLabel');
                            deleteTitle.innerHTML = 'Are you sure you want to delete <b>' + name + '</b>?';
                            deleteContent.innerHTML = 'You are about the permanently delete a patient record and all associated medical records. This will permanently remove <b>' + name + '</b> from our systems. Are you sure you want to proceed?';
                            deleteButton.addEventListener('click', () => {
                                const url = '/portal/api/patients/' + id + '?_method=delete';
                                fetch(url, {method: 'post'})
                                .then(response => response.json())
                                .then((data)=>{
                                    if(data?.error){
                                        document.querySelector('.table-alert').innerHTML = '<div class="alert alert-danger alert-dismissible fade show" role="alert">Could not delete patient.<br>Reason: '+ data.error + '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
                                        modal.hide();
                                    }else{
                                        window.location.reload();
                                    }
                                })
                                .catch(err=>({}));
                            });
                            modal.show();
                        }
                        if(!document.getElementById('deleteModal')){
                            const modalDiv = document.createElement('div');
                            modalDiv.classList.add('modal', 'fade');
                            modalDiv.id = 'deleteModal';
                            modalDiv.tabIndex = '-1';
                            modalDiv.setAttribute('aria-labelledby', 'deleteModalLabel');
                            modalDiv.setAttribute('aria-hidden', 'true');
                            const modalDialog = document.createElement('div');
                            modalDialog.classList.add('modal-dialog');
                            const modalContent = document.createElement('div');
                            modalContent.classList.add('modal-content');
                            const modalHeader = document.createElement('div');
                            modalHeader.classList.add('modal-header');
                            const modalTitle = document.createElement('h5');
                            modalTitle.classList.add('modal-title');
                            modalTitle.id = 'deleteModalLabel';
                            modalTitle.textContent = 'Are you sure you want to delete?';
                            const closeButton = document.createElement('button');
                            closeButton.type = 'button';
                            closeButton.classList.add('btn-close');
                            closeButton.setAttribute('data-bs-dismiss', 'modal');
                            closeButton.setAttribute('aria-label', 'Close');
                            const modalBody = document.createElement('div');
                            modalBody.classList.add('modal-body');
                            modalBody.textContent = 'You are about the permanently delete a patient record and all associated medical records. Are you sure you want to proceed?';
                            const modalFooter = document.createElement('div');
                            modalFooter.classList.add('modal-footer');
                            const cancelButton = document.createElement('button');
                            cancelButton.type = 'button';
                            cancelButton.classList.add('btn', 'btn-secondary');
                            cancelButton.setAttribute('data-bs-dismiss', 'modal');
                            cancelButton.textContent = 'Cancel';
                            const deleteButton = document.createElement('button');
                            deleteButton.type = 'button';
                            deleteButton.classList.add('btn', 'btn-danger');
                            deleteButton.id = 'confirmDeleteBtn';
                            deleteButton.textContent = 'Delete';
                            modalHeader.appendChild(modalTitle);
                            modalHeader.appendChild(closeButton);
                            modalFooter.appendChild(cancelButton);
                            modalFooter.appendChild(deleteButton);
                            modalContent.appendChild(modalHeader);
                            modalContent.appendChild(modalBody);
                            modalContent.appendChild(modalFooter);
                            modalDialog.appendChild(modalContent);
                            modalDiv.appendChild(modalDialog);
                            document.body.appendChild(modalDiv);
                            
                        }
                        `
                    }
                        for(let i = 0; i<svgs.length; i++){
                            const a = document.createElement('a');
                            a.href = hrefs[i];
                            a.className = classes[i];
                            a.innerHTML = svgs[i];
                            const li = document.createElement('li');
                            li.className = 'nav-item';
                            li.appendChild(a);
                            ${!allowDelete ? '' : `
                            if(i===svgs.length-1){
                                a.dataset.delVal = val;
                                a.dataset.delName = name;
                                a.addEventListener('click',e =>{
                                    e.preventDefault();
                                    let trgt;
                                    if(e.target.hasAttribute('A')){
                                        trgt = e.target;
                                    }else{
                                        trgt = e.target.closest('a');
                                    }
                                    showModal(trgt.dataset.delVal,trgt.dataset.delName);
                                })
                            }                            
                            `}
                            td.appendChild(li);
                            //td.appendChild(a);
                        }
                        const nav = document.createElement('nav');
                        nav.className = 'navbar navbar-expand-lg navbar-light bg-light centered-collapse-menu';

                        const button = document.createElement('button');
                        button.className = 'navbar-toggler';
                        button.type = 'button';
                        button.dataset.bsToggle = 'collapse';
                        button.dataset.bsTarget = '#navbarSupportedContent'+id;
                        button.ariaControls = 'navbarSupportedContent';
                        button.ariaExpanded = 'false';
                        button.ariaLabel = 'Toggle navigation';

                        const span = document.createElement('span');
                        span.className = 'navbar-toggler-icon';

                        button.appendChild(span); 

                        const div = document.createElement('div');
                        div.className = 'collapse navbar-collapse';
                        div.id = 'navbarSupportedContent'+id;

                        const ul = document.createElement('ul');
                        ul.className = 'navbar-nav mr-auto navbar-ul-centered mb-2';

                        while(td.firstChild){
                            ul.appendChild(td.firstChild);
                        }

                        div.appendChild(ul);
                        nav.appendChild(button);
                        nav.appendChild(div);
                        td.appendChild(nav);
                        res();
                    })`,
                }
            ],
            URL: ({ filterBy, filterValue } = {}) => `/portal/api/patients?includeLatestExamDate=true${(filterBy && filterValue) ? `&filter=${filterBy}=${filterValue}` : ''}`,
            FetchFunction: `(opts)=>{
                return new Promise((res,err)=>{
                    let fUrl = opts.url;
                    if(opts.sort?.sortBy){
                        fUrl += '&sortBy=' + opts.sort.sortBy + '&order=';
                        fUrl += opts.sort.asc ? 'ascending' : 'descending';
                        if(parseInt(opts.limit)>0){
                            fUrl += '&limit=' + parseInt(opts.limit) + '&page=' + parseInt(opts.page);
                        }
                    }
                    
                    fetch(fUrl)
                    .then(response => response.json())
                    .then(data => {
                        const rows = [];
                        data.data.forEach(item => {
                            rows.push([item.name,calculateAge(item.dateOfBirth),item.gender,item.latestExamDate ? getDate(item.latestExamDate) : 'N/A' ,item.numExams, {id: item._id, name: item.name }],
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
                        fUrl += '&limit=' + parseInt(opts.limit) + '&page=' + parseInt(opts.page);
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
                            fUrl += '&limit=' + parseInt(opts.limit) + '&page=' + parseInt(opts.page);
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
        AllExamsOfPatient: {
            URL: id => `/portal/api/patients/${id}/examinations?`,
            TableHeaders: [
                {
                    text: 'Exam Date',
                    sort: { sortBy: 'date' },
                },
                {
                    text: 'Examiner',
                    sort: { sortBy: 'examiner.name' },
                },
                {
                    text: 'Exam Notes',
                },
                {
                    text: 'Consultation?',
                    sort: { sortBy: 'hasConsultation' },
                },
                {
                    text: 'Image Count',
                    sort: { sortBy: 'numImages' },
                },
                {
                    text: '',
                    parseFunction: `(data,td) => new Promise((res,rej)=>{
                        const a = document.createElement('a');
                        a.href = '/portal/examinations/' + data;
                        a.className = 'btn btn-info';
                        a.innerHTML = '${Utils.Icons.EyeIcon}';
                        td.appendChild(a);
                    });`
                }
            ],
            FetchFunction: `(opts)=>{
                return new Promise((res,err)=>{
                    let fUrl = opts.url;
                    if(opts.sort?.sortBy){
                        fUrl += '&sortBy=' + opts.sort.sortBy + '&order=';
                        fUrl += opts.sort.asc ? 'ascending' : 'descending';
                        if(parseInt(opts.limit)>0){
                            fUrl += '&limit=' + parseInt(opts.limit) + '&page=' + parseInt(opts.page);
                        }
                    }
                    maxNotesLength = 20;
                    fetch(fUrl)
                    .then(response => response.json())
                    .then(data => {
                        const rows = [];
                        data.data.forEach(item => {
                            rows.push([getDate(item.date),item.examiner.name, item.notes.substring(0,Math.min(maxNotesLength,item.notes.length)) + '...', item.hasConsultation ? 'yes' : 'no',  item.images ? item.images.length : 0, item._id ]
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