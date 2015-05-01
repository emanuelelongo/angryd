angular.module('angryd')
    .config(['$provide', 'angryd_skin', function ($provide, skin) {
        skin['basic-ita'] = {
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
                insert: 'Aggiungi',
                edit: 'Modifica',
                confirm: 'OK',
                revert: 'Annulla',
                remove: 'Elimina',
                reload: 'Aggiorna',
                first: null,
                prev: null,
                next: null,
                last: null,
                pagingInfo: 'Righe: <b>{{ curRowIndex + 1 }}</b> - <b>{{ curRowIndex + curPageSize }}</b> di <b>{{ totalRows }}</b>',
                selectionInfo: 'Selezionati: <b>{{countSelection()}}</b> di <b>{{ totalRows }}</b>',
                orderBy: 'Ordinamento',
                ascSorting: '>',
                descSorting: '<'
            }
        };
    }]);