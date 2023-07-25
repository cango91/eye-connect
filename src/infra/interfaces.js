const iNav = {
    items: [
        {
            text: null,
            href: null,
            dropdown: null,
            showInFooter: null
        },
        {
            text: null,
            href: null,
            showInFooter: null,
            dropdown: [{
                text: null,
                href: null,
            }],
        },
    ],
    active: null,
}

const tableData = {
    caption: 'String | null',
    head: [
        {
            text: 'String',
            sort: {
                asc: {
                    href: 'String',
                    active: true | null // Boolean | null
                },
                dsc: {
                    href: 'String'
                }
            }
        },
        "Non-Sorting headers"
    ],
    dataUrl: 'String',
    parseFunction: 'String',
    footer: []
}


const tableBuildData = {
    id,
    caption,
    fetchOpts,
    fetchFn, //Promise -> return an array of arrays, params: opts:{}
    columns: [
        {
            text,
            parseFn, //Promise, optional
            sort: // optional
            {
                sortBy, // the sortBy field. Updates opts.sort.sortBy
                onSortFn, // optional, params: asc:Boolean, opts:{} gets called before fetchFn is called
            }

        }
    ]
}
/*
opts: {
    maxPage:
    page:
    limit:
    sort:{
        sortBy,
        asc
    }
}
*/