// const tableHandler = (id, dataSourceUrl, dataMethod = 'GET', parseFunction, columnsData, initPage=1, initLimit=0) => {

//     const toggleActiveClass = (columnIndex, asc) => {
//         const ths = document.querySelectorAll(`#${id}-data-table th`);
//         ths.forEach((th, idx) => {
//             const sortSpans = th.querySelectorAll('.table-sort');
//             const sortAsc = sortSpans[0];
//             const sortDsc = sortSpans[1];
//             if (idx !== columnIndex) {
//                 sortAsc.classList.remove('active');
//                 sortDsc.classList.remove('active');
//                 sortAsc.innerHTML = `<a href="${columnsData[idx]?.sort?.asc?.href}">${sortAsc.textContent}</a>`
//                 sortDsc.innerHTML = `<a href="${columnsData[idx]?.sort?.dsc?.href}">${sortDsc.textContent}</a>`
//             } else {
//                 sortAsc.classList.toggle('active', asc);
//                 sortDsc.classList.toggle('active', !asc);
//                 sortAsc.innerHTML = asc ? sortAsc.textContent : `<a href="${columnsData[columnIndex]?.sort?.asc?.href}">${sortAsc.textContent}</a>`;
//                 sortDsc.innerHTML = asc ? `<a href="${columnsData[columnIndex]?.sort?.dsc?.href}">${sortDsc.textContent}</a>` : sortDsc.textContent;
//             }
//         });
//     }

//     const page = <%= page %>;
//     const itemsPerPage = <%= itemsPerPage %>;
//     const populateTable = (url, columnIndex = null, asc = null) => {
//         fetch(`${url}?page=${page}&limit=${itemsPerPage}`, {
//             method: dataMethod,
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         })
//             .then(response => response.json())
//             .then(data => {
//                 // Parse the data
//                 const parsedData = parseFunction(data);

//                 // Get the table body
//                 const tbody = document.getElementById(`${id}-data-body`);

//                 // Clear any existing rows
//                 while (tbody.firstChild) {
//                     tbody.firstChild.remove();
//                 }

//                 // Add new rows
//                 parsedData.forEach(row => {
//                     const tr = document.createElement('tr');
//                     Object.values(row).forEach(value => {
//                         const td = document.createElement('td');
//                         td.textContent = value;
//                         tr.appendChild(td);
//                     });
//                     tbody.appendChild(tr);
//                 });

//                 if (columnIndex !== null) {
//                     // Toggle active class and surrounding <a> tags
//                     toggleActiveClass(columnIndex, asc);
//                 }
//             });
//     }


// }

const tableHandler = (
    parentElement,
    id,
    caption,
    fetchOptions = {} = {
        method: 'GET',
        url: null,
        page: 1,
        maxPage: 0,
        limit: 0,
        sort: {} = {
            sortBy: null,
            asc: null,
        }
    },
    fetchFunction,
    headerData,
    tableClasses = ['table', 'caption-top']
) => {
    parentElement = parentElement ? parentElement : document.body;
    // BUILDING TABLE
    const table = document.createElement('table');
    table.id = `${id}-data-table`;
    table.dataset.page = fetchOptions.page;
    table.dataset.maxPage = fetchOptions.maxPage;
    table.dataset.limit = fetchOptions.limit;
    table.dataset.sortBy = fetchOptions.sort.sortBy;
    table.dataset.sortAscending = fetchOptions.sort.asc;
    table.className = tableClasses.join(' ');
    if (caption) {
        const cap = document.createElement('caption');
        cap.textContent = caption;
        table.appendChild(cap);
    }
    const thead = document.createElement('thead');
    const tr = document.createElement('tr');
    headerData.forEach((data, idx) => {
        const th = document.createElement('th');
        th.scope = "col";
        th.textContent = data.text;
        if (data.sort) {
            th.dataset
            th.dataset.sortBy = data.sort.sortBy;
            th.dataset.colIdx = idx;
            const spanAsc = document.createElement('span');
            const spanDesc = document.createElement('span');
            spanDesc.className = 'table-sort';
            spanAsc.className = 'table-sort';
            if (!fetchOptions.sort.sortBy || fetchOptions.sort.sortBy !== data.sort.sortBy) {
                const a = document.createElement('a');
                a.href = '#';
                a.innerText = ` ↑`;
                a.dataset.sortAsc = '';
                spanAsc.appendChild(a);
                const d = document.createElement('a');
                d.href = '#';
                d.innerText = `↓`
                d.dataset.sortDsc = '';
                spanDesc.appendChild(d);
            } else {
                if (fetchOptions.sort.asc) {
                    spanAsc.appendChild(document.createTextNode(' ↑'));
                    const d = document.createElement('a');
                    d.href = '#';
                    d.innerHTML = '↓';
                    d.dataset.sortDsc = '';
                    spanDesc.appendChild(d);
                } else {
                    spanDesc.appendChild(document.createTextNode('↓'));
                    const a = document.createElement('a');
                    a.href = '#';
                    a.innerText = ` ↑`;
                    a.dataset.sortAsc = '';
                    spanAsc.appendChild(a);
                }
            }
            th.appendChild(spanAsc);
            th.appendChild(document.createTextNode(' | '));
            th.appendChild(spanDesc);
        }
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);
    const tbody = document.createElement('tbody');
    tbody.id = `${id}-data-body`;
    table.appendChild(tbody);
    parentElement.appendChild(table);
    //FINISH TABLE

    const makeAnchor = (asc=false) =>{
        const a = document.createElement('a');
        a.href = '#';
        if(asc){
            a.innerText=' ↑';
            a.dataset.sortAsc = '';
        }else{
            a.innerText='↓';
            a.dataset.sortDsc = '';
        }
        return a;
    }

    const onSort = (idx,asc=false) =>{
        fetchOptions.sort.sortBy = headerData[idx]?.sort?.sortBy;
        fetchOptions.sort.asc = asc;
        if(headerData[idx]?.sort?.onSortFunction){
            headerData[idx].sort.onSortFunction(options,asc);
        }
        populateTable();
    }

    const toggleActiveClass = (idx, asc=false) => {
        const ths = thead.querySelectorAll('th[data-col-idx]');
        ths.forEach(th => {
            // Convert dataset string to integer
            let thIdx = parseInt(th.dataset.colIdx);
    
            // Remove 'active' class from all '.table-sort' elements
            const sorts = th.querySelectorAll('.table-sort');
            sorts.forEach(sort => sort.classList.remove('active'));
    
            if(thIdx !== parseInt(idx)){
                sorts.forEach(sort => {
                    while(sort.firstChild) sort.firstChild.remove();
                    sort.appendChild(makeAnchor(sort === sorts[0]));
                });
            } else {
                let targetSort = sorts[asc ? 0 : 1];
                let otherSort = sorts[asc ? 1 : 0];
                targetSort.classList.add('active');
    
                let arrow = document.createTextNode(asc ? ' ↑' : ' ↓');
                while(targetSort.firstChild) targetSort.firstChild.remove();
                targetSort.appendChild(arrow);
    
                // Clear and rebuild the sibling 'table-sort' span
                while(otherSort.firstChild) otherSort.firstChild.remove();
                otherSort.appendChild(makeAnchor(!asc));
            }
        });
    }
    

    const updateDataset = () =>{
        table.dataset.page = fetchOptions.page;
        table.dataset.maxPage = fetchOptions.maxPage;
        table.dataset.limit = fetchOptions.limit;
        table.dataset.sortBy = fetchOptions.sort.sortBy;
        table.dataset.sortAscending = fetchOptions.sort.asc;
    }

    const populateTable = () => {
        fetchFunction(fetchOptions).then(data => {
            while (tbody.firstChild) {
                tbody.firstChild.remove();
            }
            data.forEach(row => {
                const tr = document.createElement('tr');
                Object.values(row).forEach((value, idx) => {
                    const td = document.createElement('td');
                    if (headerData[idx].parseFunction) {
                        const parseFn = new Function(`return ${headerData[idx].parseFunction}`)();
                        parseFn(value,td).then(data => td.textContent=data);
                    } else {
                        td.textContent = value;
                    }
                    tr.appendChild(td);
                });
                tbody.appendChild(tr);
            });
            updateDataset();
            const idx = headerData.findIndex(item => item?.sort?.sortBy === fetchOptions.sort.sortBy);
            if(idx>-1){
                toggleActiveClass(idx,fetchOptions.sort.asc);
            }
        });
    }

    thead.addEventListener('click', e =>{
        e.preventDefault();
        if(e.target.hasAttribute('data-sort-asc')||e.target.hasAttribute('data-sort-dsc')){
            const span = e.target.parentElement;
            if(span.classList.contains('active')) return;
            const asc = e.target.hasAttribute('data-sort-asc');
            const th = span.parentElement;
            onSort(th.dataset.colIdx,asc);
            toggleActiveClass(th.dataset.colIdx,asc);
            return;
        }
        return;
    });

    populateTable();

}