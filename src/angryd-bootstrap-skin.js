angular.module('angryd')
    .config(['$provide', 'angryd_skin', function ($provide, skin) {
        skin['bootstrap'] = {
            style: '<style>\
                        .button {cursor:pointer; margin-right:5px; margin-left:5px;}\
                        .button[disabled] {pointer-events: none; cursor: not-allowed; filter: alpha(opacity=65); -webkit-box-shadow: none; box-shadow: none; opacity: .65;}\
                        .red, .red:hover{color:red}\
                        .green, .green:hover{color:green}\
                        .blue, .blue:hover {color: blue}\
                        .brown, .brown:hover {color: brown}\
                        .panel-footer {width:100% !important; background-color: #E0D9EC}\
                        .panel-heading {background-color: #6f5499 !important; color:white !important; font-weight:bold;}\
                        .actionBox {text-align: left; padding-left:10px;}\
                        .sortingBox {border: solid 1px E0D9EC; background-color:#FFF;} \
                        .pagerBox {text-align: center;}\
                        .infoBox {text-align: right; padding-right:10px;}\
                        .tableHead {-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;}\
                        .sortableHead {cursor:pointer; text-decoration:underline;}\
                    </style>',
            classMap: {
                container: 'panel panel-default',
                header: 'panel-heading',
                table: 'table table-striped table-bordered table-hover table-condensed',
                tableHead: 'tableHead',
                tableHeadSort: 'sortableHead',
                footer: 'panel-footer',
                removeBtn: 'glyphicon glyphicon-trash button red',
                insertBtn: 'glyphicon glyphicon-plus button blue',
                reloadBtn: 'glyphicon glyphicon-refresh button yellow',
                editBtn: 'glyphicon glyphicon-pencil button blue',
                confirmBtn: 'glyphicon glyphicon-ok button green ',
                revertBtn: 'glyphicon glyphicon-remove button red',
                footerActionBox: 'actionBox',
                firstBtn: 'glyphicon glyphicon-step-backward button',
                prevBtn: 'glyphicon glyphicon-chevron-left button',
                nextBtn: 'glyphicon glyphicon-chevron-right button',
                lastBtn: 'glyphicon glyphicon-step-forward button',
                footerSortingBox: 'table-bordered sortingBox',
                footerPagerBox: 'pagerBox',
                footerInfoBox: 'infoBox'
            },
            textMap: {
                insert: '',
                edit: '',
                confirm: '',
                revert: '',
                remove: '',
                reload: '',
                first: '',
                prev: '',
                next: '',
                last: '',
                pagingInfo: null,
                selectionInfo: null,
                orderBy: 'Sorting by',
                ascSorting: '<span class="dropup"><span class="caret"></span></span>',
                descSorting: '<span class="caret"></span>'
            }
        };
    }]);