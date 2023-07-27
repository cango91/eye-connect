const tableHandler = (
    parentElement,
    id,
    caption,
    fetchOptions = {} = {
        method: 'GET',
        url: null,
        page: 1,
        pageCount: 0,
        limit: 0,
        sort: {} = {
            sortBy: null,
            asc: null,
        }
    },
    fetchFunction,
    headerData,
    tableClasses = ['table', 'caption-top'],
) => {
    const originalOpts = Object.assign({},{
        page: fetchOptions.page,
        limit: fetchOptions.limit
    });
    parentElement = parentElement ? parentElement : document.body;
    // BUILDING TABLE
    const table = document.createElement('table');
    table.id = `${id}-data-table`;
    table.dataset.page = fetchOptions.page;
    table.dataset.pageCount = fetchOptions.pageCount;
    table.dataset.limit = fetchOptions.limit;
    table.dataset.sortBy = fetchOptions.sort.sortBy;
    table.dataset.sortAscending = fetchOptions.sort.asc;
    table.className = tableClasses.join(' ');

    const cap = document.createElement('caption');
    const capSpan = document.createElement('span');
    cap.appendChild(capSpan);
    if (caption) capSpan.textContent = caption;
    table.appendChild(cap);
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

    //Add alert
    const alertDiv = document.createElement('div');
    alertDiv.id = `${id}-table-alert`;
    alertDiv.className = 'table-alert';
    document.body.appendChild(alertDiv);

    // Add page controls
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Previous';
    prevButton.classList.add('btn', 'btn-primary');

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.classList.add('btn', 'btn-primary');

    // Create a container for the pagination controls
    const paginationContainer = document.createElement('div');
    paginationContainer.classList.add('d-flex', 'justify-content-between');
    paginationContainer.append(prevButton, nextButton);

    // Insert pagination controls into the DOM
    table.parentNode.insertBefore(paginationContainer, table.nextSibling);

    // Update the visibility of the pagination controls based on the page count
    const updatePaginationVisibility = () => {
        prevButton.style.display = (fetchOptions.page > 1) ? 'block' : 'none';
        nextButton.style.display = (fetchOptions.page < fetchOptions.pageCount) ? 'block' : 'none';
    };

    prevButton.addEventListener('click', ()=>{
        table.dataset.page = Math.min(1,parseInt(table.dataset.page)-1).toString();
        updateOpts();
        populateTable().then(updatePaginationVisibility);
    })

    nextButton.addEventListener('click', ()=>{
        table.dataset.page = Math.max(table.dataset.pageCount,parseInt(table.dataset.page)+1).toString();
        updateOpts();
        populateTable().then(updatePaginationVisibility);
    })

    const makeAnchor = (asc = false) => {
        const a = document.createElement('a');
        a.href = '#';
        if (asc) {
            a.innerText = ' ↑';
            a.dataset.sortAsc = '';
        } else {
            a.innerText = '↓';
            a.dataset.sortDsc = '';
        }
        return a;
    }

    const onSort = (idx, asc = false) => {
        fetchOptions.sort.sortBy = headerData[idx]?.sort?.sortBy;
        fetchOptions.sort.asc = asc;
        if (headerData[idx]?.sort?.onSortFunction) {
            headerData[idx].sort.onSortFunction(options, asc);
        }else{
            fetchOptions.page = 1;
            fetchOptions.limit = originalOpts.limit;
        }
        populateTable().then(updatePaginationVisibility());
    }

    const toggleActiveClass = (idx, asc = false) => {
        const ths = thead.querySelectorAll('th[data-col-idx]');
        ths.forEach(th => {
            // Convert dataset string to integer
            let thIdx = parseInt(th.dataset.colIdx);

            // Remove 'active' class from all '.table-sort' elements
            const sorts = th.querySelectorAll('.table-sort');
            sorts.forEach(sort => sort.classList.remove('active'));

            if (thIdx !== parseInt(idx)) {
                sorts.forEach(sort => {
                    while (sort.firstChild) sort.firstChild.remove();
                    sort.appendChild(makeAnchor(sort === sorts[0]));
                });
            } else {
                let targetSort = sorts[asc ? 0 : 1];
                let otherSort = sorts[asc ? 1 : 0];
                targetSort.classList.add('active');

                let arrow = document.createTextNode(asc ? ' ↑' : ' ↓');
                while (targetSort.firstChild) targetSort.firstChild.remove();
                targetSort.appendChild(arrow);

                // Clear and rebuild the sibling 'table-sort' span
                while (otherSort.firstChild) otherSort.firstChild.remove();
                otherSort.appendChild(makeAnchor(!asc));
            }
        });
    }


    const updateDataset = () => {
        table.dataset.page = fetchOptions.page;
        table.dataset.pageCount = fetchOptions.pageCount;
        table.dataset.limit = fetchOptions.limit;
        table.dataset.sortBy = fetchOptions.sort.sortBy;
        table.dataset.sortAscending = fetchOptions.sort.asc;
    }

    const updateOpts = () => {
        fetchOptions.page = table.dataset.page;
        fetchOptions.pageCount = table.dataset.pageCount;
        fetchOptions.limit = table.dataset.limit;
        fetchOptions.sort.sortBy = table.dataset.sortBy;
        fetchOptions.sort.asc = table.dataset.sortAscending;
    }

    const populateTable = () => {
        return new Promise((resolve, reject) => {
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
                            parseFn(value, td);
                        } else {
                            td.textContent = value;
                        }
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                updateDataset();
                const idx = headerData.findIndex(item => item?.sort?.sortBy === fetchOptions.sort.sortBy);
                if (idx > -1) {
                    toggleActiveClass(idx, fetchOptions.sort.asc);
                }
                window.dispatchEvent(new CustomEvent('dataFetched', {
                    detail: {
                        handler: handler,
                        target: table,
                    }
                }))
                updatePaginationVisibility();
            }).then(resolve)
                .catch(error => {
                    reject(error);
                });
        });
    }

    // convenience functions
    const dataCount = () => (tbody.querySelectorAll('tr')).length;
    const setCaption = text => capSpan.textContent = text;
    const getOpts = () => (srt => (rslt = Object.assign({}, fetchOptions), rslt.sort = srt, rslt))(Object.assign({}, fetchOptions.sort));
    const setOpts = newOpts => {
        for (let key in newOpts) {
            if (key in fetchOptions) {
                fetchOptions[key] = newOpts[key];
            }
        }
    }

    thead.addEventListener('click', e => {
        e.preventDefault();
        if (e.target.hasAttribute('data-sort-asc') || e.target.hasAttribute('data-sort-dsc')) {
            const span = e.target.parentElement;
            if (span.classList.contains('active')) return;
            const asc = e.target.hasAttribute('data-sort-asc');
            const th = span.parentElement;
            onSort(th.dataset.colIdx, asc);
            toggleActiveClass(th.dataset.colIdx, asc);
            return;
        }
        return;
    });

    const showTableAlert = (message, type) => {
        const alertDiv = document.getElementById(`${id}-table-alert`);
        alertDiv.innerHTML = '<div class="alert alert-' + type + ' alert-dismissible fade show" role="alert">' + message +
            '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>';
    }



    const handler = {
        updateOpts,
        populateTable,
        table,
        dataCount,
        setCaption,
        getOpts,
        setOpts,
        showTableAlert,
    };

    populateTable().then(() => window.dispatchEvent(new CustomEvent('tableLoaded', {
        detail: {
            id,
            handler: handler,
            target: table,
        }
    }))).catch(err => {
        window.dispatchEvent(new CustomEvent('tableLoaded'), {
            detail: {
                id,
                handler: handler,
                target: table,
                error: err
            }
        });
    });

}

const paginationHandler = (id) => {
    const table = document.getElementById(`${id}-data-table`);
    let init = false;
    let tableHandler, page, pageCount;


    // Update the visibility of the pagination controls whenever the table updates
    window.addEventListener('dataFetched', event => {
        if (event.detail.id === id)
            tableHandler = event.detail.handler;
        if (init) {
            updatePaginationVisibility();
            pageCount = tableHandler.getOpts().pageCount;
            page = tableHandler.getOpts().page;
        }
    });

    window.addEventListener('tableLoaded', event => {
        if (event.detail.handler === tableHandler) {
            init = true;
            page = tableHandler.getOpts().page;
            pageCount = tableHandler.getOpts().pageCount;
            updatePaginationVisibility();
        }
    });

    // Attach event listeners to the pagination controls
    prevButton.addEventListener('click', () => {
        table.dataset.page = Math.max((parseInt(table.dataset.page) - 1), 1).toString();
        tableHandler.updateOpts();
        tableHandler.populateTable();
    });
    nextButton.addEventListener('click', () => {
        table.dataset.page = Math.min((parseInt(table.dataset.page) + 1), pageCount).toString();
        tableHandler.updateOpts();
        tableHandler.populateTable();
    });

    // Update the visibility of the pagination controls initially
    updatePaginationVisibility();
};
