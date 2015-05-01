angular.module('angryd')
    .config(['$provide', 'angryd_skin', function ($provide, skin) {
        skin['basic'] = {
            style: '<style>\
                        .myAngrydTableStyle, .myAngrydTableStyle td, .myAngrydTableStyle th {\
                            border: 1px solid #cfcfcf;\
                            border-collapse: collapse;\
                            padding: 5px;\
                        }\
                        .bordered{border: 1px solid #cfcfcf; }\
                        .fullsize {width:100%}\
                        .left {text-align: left; padding-left:10px;}\
                        .center{text-align: center;}\
                        .right {text-align: right; padding-right:10px;}\
                    </style>',
            classMap: {
                container: 'myAngrydStyle',
                header: 'bordered',
                table: 'fullsize myAngrydTableStyle',
                footer: 'fullsize bordered',
                removeBtn: '',
                insertBtn: '',
                reloadBtn: '',
                editBtn: '',
                confirmBtn: '',
                revertBtn: '',
                footerActionBox: 'left',
                footerPagerBox: 'center',
                footerInfoBox: 'right'
            },
            textMap: {
                insert: 'Add',
                edit: 'Modify',
                confirm: 'OK',
                revert: 'Cancel',
                remove: 'Delete',
                reload: 'Reload',
                first: null,
                prev: null,
                next: null,
                last: null,
                pagingInfo: 'View: <b>{{ curRowIndex + 1 }}</b> - <b>{{ curRowIndex + curPageSize }}</b> of <b>{{ totalRows }}</b>',
                selectionInfo: 'Selected: <b>{{countSelection()}}</b> of <b>{{ totalRows }}</b>',
                orderBy: 'Sorting',
                ascSorting: '>',
                descSorting: '<'
            }
        };
    }]);