/* 
REFACTOR THIS!
Provides static objects for controllers' convenience
Mostly dynamic table's fetch and sort functions.
Should figure out a better way to do this!
*/

module.exports = class Utils {
    static Icons = {
        EyeIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="i i-view-patient" viewBox="0 0 16 16"> <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/> <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/> </svg>`,
        PaperIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="i i-add-exam" viewBox="0 0 16 16"> <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/> <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/> <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/> </svg>`,
        PencilIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="i i-edit-patient" viewBox="0 0 16 16"> <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/> </svg>`,
        TrashIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="i i-delete" viewBox="0 0 16 16"> <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/> <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/> </svg>`,
        CheckIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="i i-save" viewBox="0 0 16 16"> <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"/> </svg>`,
        PlusIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"> <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/> <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/> </svg>`,
        CrossIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-square-fill" viewBox="0 0 16 16"> <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm3.354 4.646L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 1 1 .708-.708z"/> </svg>`,
        SaveIcon: `<svg width="16" height="16" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M3 19V5C3 3.89543 3.89543 3 5 3H16.1716C16.702 3 17.2107 3.21071 17.5858 3.58579L20.4142 6.41421C20.7893 6.78929 21 7.29799 21 7.82843V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19Z" stroke="currentColor" stroke-width="1.5"/> <path d="M8.6 9H15.4C15.7314 9 16 8.73137 16 8.4V3.6C16 3.26863 15.7314 3 15.4 3H8.6C8.26863 3 8 3.26863 8 3.6V8.4C8 8.73137 8.26863 9 8.6 9Z" stroke="currentColor" stroke-width="1.5"/> <path d="M6 13.6V21H18V13.6C18 13.2686 17.7314 13 17.4 13H6.6C6.26863 13 6 13.2686 6 13.6Z" stroke="currentColor" stroke-width="1.5"/> </svg>`,
        AddMultiple: `<svg width="24" height="24" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <path d="M1.99219 19H4.99219M7.99219 19H4.99219M4.99219 19V16M4.99219 19V22" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M7 2L16.5 2L21 6.5V19" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M11 22H16.5C17.3284 22 18 21.3284 18 20.5V8.74853C18 8.5894 17.9368 8.43679 17.8243 8.32426L14.6757 5.17574C14.5632 5.06321 14.4106 5 14.2515 5H4.5C3.67157 5 3 5.67157 3 6.5V13" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> <path d="M14 8.4V5.35355C14 5.15829 14.1583 5 14.3536 5C14.4473 5 14.5372 5.03725 14.6036 5.10355L17.8964 8.39645C17.9628 8.46275 18 8.55268 18 8.64645C18 8.84171 17.8417 9 17.6464 9H14.6C14.2686 9 14 8.73137 14 8.4Z" fill="currentColor" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/> </svg>`,
        UploadSingleIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16"> <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/> <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/> </svg>`,
        PlusIcon2: `<svg width="16" height="16" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M18 13.496h-4.501v4.484h-3v-4.484H6v-2.99h4.5V6.021h3.001v4.485H18v2.99zM21 .041H3C1.348.043.008 1.379 0 3.031v17.94c.008 1.65 1.348 2.986 3 2.988h18c1.651-.002 2.991-1.338 3-2.988V3.031c-.009-1.652-1.348-2.987-3-2.99z"/></svg>`,
        MagnifyIcon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" id="IconChangeColor" ><rect width="256" height="256" fill="none"></rect><circle cx="116" cy="116" r="84" opacity="0.2"></circle><circle cx="116" cy="116" r="84" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></circle><line x1="175.4" y1="175.4" x2="224" y2="224" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="16"></line></svg>`,
        CheckAllIcon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-all" viewBox="0 0 16 16"> <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/> </svg>`,
        ImageIcon: `<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"> <path d="M6 0h12v2H6V0zM4 3H2v18h20V3H4zm16 2v14H4V5h16zm-6 4h-2v2h-2v2H8v2H6v2h2v-2h2v-2h2v-2h2v2h2v2h2v-2h-2v-2h-2V9zM8 7H6v2h2V7zm10 17v-2H6v2h12z" fill="currentColor"/> </svg>`,
    }

    static Specialist = {
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
                    text: 'Awaiting Consultations',
                    href: '/portal/exams'
                },
                {
                    text: 'Completed Consultations',
                    href: '/portal/consultations'
                }
                ]
            }],
            active: current,
        }),
        RecentConsultations: {
            URL: id => `/portal/api/consultations?filter=consultant&filterValue=_id${id}`,
            TableHeaders: [
                {
                    text: 'Cons. Date',
                    sort: { sortBy: 'data' }
                },
                {
                    text: 'Patient',
                    sort: { sortBy: 'exam.patient.name' }
                },
                {
                    text: 'DR diagnosis',
                    sort: { sortBy: 'retinopathyDiagnosis' },
                    parseFunction: `(val,td)=> new Promise((resolve, reject) => {
                        if(!val){
                            td.textContent = "<no diagnosis>";
                            resolve("<no diagnosis>");
                        }
                        switch(val){
                            case 'NoApparentDR':
                                td.textContent = 'No DR';
                                resolve('No DR');
                                break;
                            case 'MildNPDR':
                                td.textContent = "Mild NPDR";
                                resolve('Mild NDPR');
                                break;
                            case 'ModerateNPDR':
                                td.textContent = "Moderate NDPR";
                                resolve('Moderate NPDR');
                                break;
                            case 'SevereNPDR':
                                td.textContent = "Severe NPDR";
                                resolve("Severe NPDR");
                                break;
                            case 'PDR':
                                td.textContent = "Proliferative DR";
                                resolve("Proliferative DR");
                                break;
                            default:
                                reject()

                        }
                    });`,
                },
                {
                    text: '',
                    parseFunction: `(val,td) => new Promise(resolve => {
                        const svg = '${Utils.Icons.PencilIcon}';
                        const a = document.createElement('a');
                        a.href = '/portal/exams/' + val + '/consultation';
                        a.className = 'btn btn-warning';
                        a.innerHTML = svg;
                        a.title = 'edit your consultation';
                        td.appendChild(a);
                        resolve();
                    });`,
                }
            ],
            FetchFunction: `(opts)=>{
                return new Promise((res,err)=>{
                    let fUrl = opts.url;
                    if(opts.sort?.sortBy){
                        fUrl += '&sortBy=' + opts.sort.sortBy + '&order=';
                        let sortAsc = opts.sort.asc;
                        if(opts.sort.reversed) sortAsc = !sortAsc;
                        fUrl += sortAsc ? 'ascending' : 'descending';
                        if(parseInt(opts.limit)>0){
                            fUrl += '&limit=' + parseInt(opts.limit) + '&page=' + parseInt(opts.page);
                        }
                    }
                    
                    fetch(fUrl)
                    .then(response => response.json())
                    .then(data => {
                        const rows = [];
                        data.data.forEach(item => {
                            rows.push([ getDate(item.date), item.patient.name, item.retinopathyDiagnosis, item.examination ],
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
    };
}