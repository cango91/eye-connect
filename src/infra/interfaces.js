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
    head:[
        {
            text:'String',
            sort: {
                asc:{
                    href:'String',
                    active: true | null // Boolean | null
                },
                dsc: {
                    href:'String'
                }
            }
        },
        "Non-Sorting headers"
    ],
    dataUrl: 'String',
    parseFunction: 'String',
    footer:[]
}