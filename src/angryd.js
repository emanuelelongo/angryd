/*
 Angryd v1.0.1
 (c) 2015 Emanuele Longo [longo.emanuele@gmail.com]
 License: MIT
*/

angular.module('angryd', [])
    .config(['$provide', function ($provide) {
        $provide.constant('angryd_skin', []);
    }])
    .factory('angryd.sys', function () {
        return {
            arrayRemove: function (array, condition) {
                // ToDo: why not use filter??
                var i = array.length;
                while (i--) {
                    if (condition(array[i], i)) {
                        array.splice(i, 1);
                    }
                }
            },
            isnull: function (a, b) {
                if (a == null) {
                    if (b == null) {
                        return '';
                    }
                    return b;
                }
                return a;
            },
            parseFormat: function (format) {
                if (format == null)
                    return '';
                var alignments = { 'L': 'left', 'R': 'right', 'C': 'center' };
                var pattern = new RegExp("[0-9]{1,3}[L,R,C]");
                var result = format.match(pattern);
                if (result == null || result.length !== 1)
                    throw 'ANGRYD ERROR: format attribute should match \"[0-9]{1,3}[L,R,C]\" regex\n\n';
                var patternSplit = new RegExp("[L,R,C]");
                var arraySplit = format.split(patternSplit);
                var arrayMatch = format.match(patternSplit);
                return {
                    width: arraySplit[0],
                    align: alignments[arrayMatch[0]]
                }
            },
            angrydSyntax: {
                /*  the buffer containing grid data;
                    in local mode the buffer contains the entire data set and can be handled externally,
                    for example inserting or updating rows;
                    in server mode the buffer contains just the current-page rows and is handled just internally; */
                'data': {
                    required: true
                },
                /*  When using pagination indicate how many row are shown in a single page */
                'pageSize': {},
                /*  the name of the column to be used as id for univoque identification of a row*/
                'key': {},
                /*  text used as grid title */
                'heading': {},
                /*  set the data handling policy
                    local: data are fully contained in the buffer;
                    server: data stay on the server and is access through async operation;
                    auto: agryd switch automatically from local or server mode depending on the size of the
                          entire record set.
                 */
                'mode': {
                    defaultValue: 'local',
                    values: ['local', 'server', 'auto'],
                    when: {
                        'server': {
                            'get': { required: true },
                            'count': { required: true },
                            'reload': { required: true }
                        },
                        'auto': {
                            'get': { required: true },
                            'count': { required: true },
                            'reload': { required: true }
                        }
                    }
                },
                /*  a pointer to local scope variable used to reload the grid;
                    setting this value to true cause the reload of data and the immediatelly
                    reset it's value to false */
                'reload': {},
                /*  the skin name to apply: it's module must have been imported before */
                'skin': {},
                /*  function to get data from the server; is ignored in local mode; 
                    it must return a promise whitch success will get data;
                    If specified, count must be specified too.
                */
                'get': {
                    when: {
                        any: {
                            'count': { required: true }
                        }
                    }
                },
                /*  function to get the entire record set size on the server 
                    it must return a promisi whitch success will get the total row number 
                    If specified, get must be specified too. */
                'count': {
                    when: {
                        any: {
                            'get': { required: true }
                        }
                    }
                },
                /* 
                    These attributes can be leaved unset or setted to true, false or to a function returning a promise;
                    server mode:
                        - unset     the operation is disabled
                        - false:    the operation is disabled
                        - true:     the feature button is enabled but must be handled by events
                        - function: the function is assumed to operate the action asyncrounsly and return a promise; 
                                    if the promise is rejected local storage rest invariate while
                                    if promise is succed local storage will be updated
                    local mode:
                        - unset:    the feature button is enabled and angryd will do the best it can (edit and add in line, local delete)
                        - false:    the operation is disabled
                        - true:     the feature button is enabled but must be handled by events
                        - function: the function is assumed to operate the action syncrounsly in the local storage

                    an exception to this rule is rappresented by removeRow and removeRows which ones when unsetted will try to use 
                    each other

                    in addition to this note that while removeRow and updateRow enable or disable the inline operations, removeRows and insertRow
                    enable or disable the footer button.
                */
                'removeRow': {},
                'removeRows': {},
                'insertRow': {},
                'updateRow': {}
            },
            columnSyntax: {
                'type': {
                    when: {
                        'text': {
                            'name': { required: true },
                            'label': { copyFrom: 'name' }
                        },
                        'textarea': {
                            'name': { required: true },
                            'label': { copyFrom: 'name' }
                        },
                        'select': {
                            'name': { required: true },
                            'label': { copyFrom: 'name' },
                            'options': { required: true },
                            'selectBy': { required: true },
                            'textBy': { required: true }
                        },
                        'date': {
                            'name': { required: true },
                            'label': { copyFrom: 'name' },
                            'format': { defaultValue: 'dd/MM/yyyy' },
                            'jqueryDatepickerFormat': { defaultValue: 'dd/mm/yy' }
                        },
                        'checkbox': {
                            'name': { required: true },
                            'label': { copyFrom: 'name' }
                        }
                    }
                }
            },
            applyAttributeSyntax: function (attrs, syntax) {
                var isLeaf = function (rule) { return (rule == 'defaultValue' || rule == 'required' || rule == "values" || rule == "copyFrom"); }
                var processLeaf = function (_attrs, attrName, leafName, leafValue) {

                    if (leafName == 'defaultValue') {
                        if (!_attrs.hasOwnProperty(attrName)) {
                            _attrs[attrName] = leafValue;
                        }
                    }
                    else if (leafName == 'required') {
                        if (!_attrs.hasOwnProperty(attrName)) {
                            throw 'ANGRYD ERROR: attribute "' + attrName + '" is required\n\n:-(\n\n';
                        }
                    }
                    else if (leafName == 'values') {
                        if (leafValue.indexOf(_attrs[attrName]) < 0) {
                            var error = 'ANGRYD ERROR: attribute "' + attrName + '" must have one of following values:  ';
                            for (var v in leafValue)
                                error = error + '"' + leafValue[v] + '", ';
                            throw error.slice(0, error.length - 2) + '; Found "' + _attrs[attrName] + '"\n\n:-(\n\n';

                        }
                    }
                    else if (leafName == 'copyFrom') {
                        if (!_attrs.hasOwnProperty(attrName)) {
                            _attrs[attrName] = _attrs[leafValue];
                        }
                    }
                }

                var process = function (rules, _attrs) {
                    for (var attrName in rules) {
                        for (var rule in rules[attrName]) {
                            if (isLeaf(rule)) {
                                processLeaf(_attrs, attrName, rule, rules[attrName][rule]);
                            }
                            else if (rule == 'when') {
                                if (_attrs.hasOwnProperty(attrName)) {
                                    if (rules[attrName][rule][_attrs[attrName]]) {
                                        process(rules[attrName][rule][_attrs[attrName]], _attrs);
                                    }
                                    if (rules[attrName][rule].hasOwnProperty('any')) {
                                        process(rules[attrName][rule].any, _attrs);
                                    }
                                }
                            }
                        }
                    }
                }
                return process(syntax, attrs);
            }
        }
    })

    .directive('angrydTransclude', function () {
        return {
            compile: function (tElement, tAttrs, transclude) {
                return function (scope, iElement, iAttrs) {
                    transclude(scope.$new(), function (clone) {
                        iElement.append(clone);
                    });
                };
            }
        };
    })

    .directive('angryd', ['angryd_skin', '$q', 'angryd.sys', '$filter', function (skin, $q, sys, $filter) {
        return {
            restrict: 'E',
            scope: {
                usrData: '=data',
                usrHeading: '=heading',
                usrReload: '=reload',
                usrGet: '=get',
                usrCount: '=count',
                usrRemoveRow: '=removeRow',
                usrRemoveRows: '=removeRows',
                usrUpdateRow: '=updateRow',
                usrInsertRow: '=insertRow',
                usrEventHandler: '=eventHandler',
                usrOnRowRemoving: '=onRowRemoving',
                usrOnRowRemoved: '=onRowRemoved',
                usrOnRowUpdating: '=onRowUpdating',
                usrOnRowUpdated: '=onRowUpdated',
                usrOnRowInserting: '=onRowInserting',
                usrOnRowInserted: '=onRowInserted'
            },
            template: function (tElem, tAttrs) {
                var style = '', classMap = {}, textMap = {};
                if (tAttrs.skin) {
                    if (!skin[tAttrs.skin])
                        throw 'ANGRYD ERROR: skin "' + tAttrs.skin + '" not found in any angryd-skin file';
                    style = skin[tAttrs.skin].style;
                    classMap = skin[tAttrs.skin].classMap;
                    textMap = skin[tAttrs.skin].textMap;
                }

                return '<div style="width:' + sys.isnull(tAttrs.width) + '" class="' + sys.isnull(classMap.container) + '">' +
                    style +
                    '<div ng-if="usrHeading" class="' + sys.isnull(classMap.header) + '" style="width:100%">\
                        {{usrHeading}}\
                    </div>\
                        <table style="width:100%" class="' + sys.isnull(classMap.table) + '">\
                            <tr><th ng-repeat="h in headers" class="' + sys.isnull(classMap.tableHead) + '" style="text-align:{{h.align}}">\
                            <span ng-class="{' + sys.isnull(classMap.tableHeadSort, 'angryd_sortable_head') + ': h.sort!=null}" ng-click="toggleSort(h)" style="color:inherit; text-align:{{h.align}}">\
                                {{h.label}}\
                                <span ng-if="h.sort == 1">'+
                                    sys.isnull(textMap.ascSorting, '^') +
                                '</span>\
                                <span ng-if="h.sort == 2">' +
                                     sys.isnull(textMap.descSorting, 'v') +
                                '</span>\
                            </span>\
                            </th></tr>\
                            <tr ng-repeat="dataRow in usrData | filter:pagerFunc" angryd-transclude></tr>\
                        </table>\
                        <table ng-if="footerVisible" style="width:100%" class="' + sys.isnull(classMap.footer) + '">\
                            <tr ng-if="currentSorting">\
                                <td colspan=3>\
                                    <div class="' + sys.isnull(classMap.footerSortingBox) + '">\
                                        <b>' + sys.isnull(textMap.orderBy, 'Order by') + '</b>: {{currentSorting}}\
                                    </div>\
                                </td>\
                            </tr>\
                            <tr >\
                                <td style="width:33%">\
                                    <div class="' + sys.isnull(classMap.footerActionBox) + '">\
                                        <span ng-if="footerInsertEnabled" ng-click="addRow()" class="' + sys.isnull(classMap.insertBtn) + '">' + sys.isnull(textMap.insert, '[ Insert ]') + '</span>\
                                        <span ng-if="footerRemoveEnabled" ng-click="removeRows()" class="' + sys.isnull(classMap.removeBtn) + '">' + sys.isnull(textMap.remove, '[ Remove ]') + '</span>\
                                        <span ng-click="refresh()" class="' + sys.isnull(classMap.reloadBtn) + '">' + sys.isnull(textMap.reload, '[ Reload ]') + '</span>\
                                    </div>\
                                </td>\
                            <td style="width:34%">\
                                <div ng-if="usrPageSize" class="' + sys.isnull(classMap.footerPagerBox) + '">\
                                    <span ng-disabled="curPageNum == 1" ng-click="gotoFirstPage()" class="' + sys.isnull(classMap.firstBtn) + '">' + sys.isnull(textMap.first, '[ << ]') + '</span>&nbsp;\
                                    <span ng-disabled="curPageNum == 1" ng-click="gotoPrevPage()" class="' + sys.isnull(classMap.prevBtn) + '">' + sys.isnull(textMap.prev, '[ < ]') + '</span>&nbsp;\
                                    <input type="text" style="width:30px; text-align:center;" angryd-enter="gotoPage()" ng-model="$parent.$parent.curPageNum" >&nbsp; / &nbsp;{{totalPages}}\
                                    <span ng-disabled="curPageNum == totalPages" ng-click="gotoNextPage()" class="' + sys.isnull(classMap.nextBtn) + '">' + sys.isnull(textMap.next, '[ > ]') + '</span>&nbsp;\
                                    <span ng-disabled="curPageNum == totalPages" ng-click="gotoLastPage()" class="' + sys.isnull(classMap.lastBtn) + '">' + sys.isnull(textMap.last, '[ >> ]') + '</span>\
                                </div>\
                            </td>\
                            <td style="width:33%">\
                                <div ng-if="curPageSize > 0 && countSelection() == 0" class="' + sys.isnull(classMap.footerInfoBox) + '">' +
                                    sys.isnull(textMap.pagingInfo, 'View: <b>{{ curRowIndex + 1 }}</b> - <b>{{ curRowIndex + curPageSize }}</b> of <b>{{ totalRows }}</b>') +
                                '</div>\
                                <div ng-if="countSelection() > 0" class="' + sys.isnull(classMap.footerInfoBox) + '">' +
                                    sys.isnull(textMap.selectionInfo, 'Selected: <b>{{countSelection()}}</b> of <b>{{ totalRows }}</b>') +
                                '</div>\
                            </td>\
                        </tr>\
                    </table>\
                </div>';
            },
            replace: true,
            transclude: true,
            link: function (scope, elem, attrs) {
                sys.applyAttributeSyntax(attrs, sys.angrydSyntax);

                // user configuration variables
                scope.configuredMode = attrs.mode;  // local, server or auto
                scope.key = attrs.key;
                scope.skin = attrs.skin;
                scope.usrPageSize = parseInt(attrs.pageSize, 10);
                // variables for current status
                scope.selectedRows = [];
                scope.curPageNum = 0;               
                scope.curRowIndex = 0;
                scope.curPageSize = 0;
                scope.totalPages = 0;
                scope.totalRows = 0;

                // computed variables 
                scope.totalWidth = 0;               // total grid width
                scope.footerRemoveEnabled = typeof(scope.usrRemoveRows) == "function" || scope.usrRemoveRows === true;
                scope.footerInsertEnabled = typeof(scope.usrInsertRow) == "function" || scope.usrInsertRow === true;
                scope.footerVisible = scope.footerRemoveEnabled || scope.footerInsertEnabled || scope.usrPageSize;
                scope.getOptions = {};              // option passed to server when getting data-pages

                /*  calculate percentage width of a column starting from its fraction number
                    (ex: 3 in 3-4-3 becomes 30%) */
                scope.columnWidth = function (fraction) {
                    return (fraction / scope.totalWidth) * 100;
                };

                // tells if some selection has been activated by UI
                scope.isSortingActive = function (head) {
                    // 1 => Ascending; 2 => Descending
                    return head.sort == 1 || head.sort == 2;
                };

                // change sorting mode
                scope.toggleSort = function (h) {
                    if (h.sort == null)
                        return;
                    // circular changing of stage NONE -> ASC -> DESC 
                    h.sort = ++h.sort % 3;
                    if (!h.sort)
                        h.sortPriority = null;
                    else
                        h.sortPriority = (Math.max.apply(null, scope.headers.map(function (i) { return i.sortPriority || 0; }))) + 1;

                    var sortCriterion =
                        $filter('orderBy')(scope.headers, 'sortPriority')
                        .filter(scope.isSortingActive)
                        .map(function (i) {
                            return {
                                field: i.name,
                                dir: i.sort == 1 ? 'asc' : 'desc'
                            };
                        });

                    // in local mode sort is made locally with javascript native sort function
                    if (scope.currentMode == 'local') {    
                        scope.usrData.sort(function (a, b) {
                            for (var sc in sortCriterion) {
                                if (sortCriterion[sc].dir == 'asc') {
                                    if (a[sortCriterion[sc].field] < b[sortCriterion[sc].field])
                                        return -1;
                                    else if (a[sortCriterion[sc].field] > b[sortCriterion[sc].field])
                                        return 1;
                                }
                                else if (sortCriterion[sc].dir == 'desc') {
                                    if (a[sortCriterion[sc].field] > b[sortCriterion[sc].field])
                                        return -1;
                                    else if (a[sortCriterion[sc].field] < b[sortCriterion[sc].field])
                                        return 1;
                                }
                            }
                            return 0;
                        });
                    }
                    /*  in server and auto mode, sort is delegated to server;
                        the sorting criteria are passed in the getOptions in two format: as array and as sql expression */
                    else {
                        scope.getOptions.sort = sortCriterion;  // array example: [field: "name", dir: 'asc']
                        scope.getOptions.sortExpr =             // sql format example: name asc
                            $filter('orderBy')(scope.headers, 'sortPriority')
                            .filter(scope.isSortingActive)
                            .map(function (i) {
                                return i.name + " " + (i.sort == 1 ? 'asc' : 'desc');
                            })
                            .join(', ');
                        scope.refresh();
                    }
                    // currentSorting variable is used to show information in the UI about current sorting setting
                    scope.currentSorting =
                        $filter('orderBy')(scope.headers, 'sortPriority')
                        .filter(scope.isSortingActive)
                        .map(function (i) { return i.label; })
                        .join(', ');
                }

                // how many row are selected
                scope.countSelection = function () {
                    return scope.selectedRows.filter(function (elem) { return elem == true; }).length;
                }

                // reload data and calculate pagin status 
                scope.refresh = function () {
                    if (scope.currentMode == "server") {
                        // get the total number of rows form the server
                        var countPromise = scope.usrCount();

                        /*  in auto mode the total rows count promise needs to be resolved before 
                            the data-page request */
                        if (scope.configuredMode == "auto") {
                            countPromise.then(function (response) {
                                scope.totalRows = response.data;
                                /*  if total rows count is less then a fixed threshold
                                    the entire record set will be downloaded locally 
                                    and the current mode switch to local */
                                if (scope.totalRows <= 50) { // todo: make threshold configurable
                                    scope.currentMode = "local";
                                    scope.usrGet(0, scope.totalRows, scope.getOptions)
                                        .then(function (resp) {
                                            scope.usrData = resp.data;
                                            scope.refresh();
                                        });
                                }
                                // otherwise get just the current data-page
                                else {
                                    scope.usrGet(scope.curRowIndex, scope.usrPageSize, scope.getOptions)
                                        .then(function (resp) {
                                            scope.usrData = resp.data;
                                            scope.curPageSize = scope.usrData.length;
                                            scope.curPageNum = Math.ceil(scope.curRowIndex / scope.usrPageSize) + 1;
                                            scope.totalPages = Math.ceil(scope.totalRows / scope.usrPageSize);
                                        });
                                }
                            });
                        }
                        /* in pure server mode the count promise and the data-page promise can be resolved togheter */
                        else {
                            var dataPromise = scope.usrGet(scope.curRowIndex, scope.usrPageSize, scope.getOptions);
                            $q.all([dataPromise, countPromise]).then(function (values) {
                                scope.usrData = values[0].data;
                                scope.curPageSize = scope.usrData.length;
                                scope.totalRows = values[1].data;
                                scope.curPageNum = Math.ceil(scope.curRowIndex / scope.usrPageSize) + 1;
                                scope.totalPages = Math.ceil(scope.totalRows / scope.usrPageSize);
                            });
                        }
                    }
                    // in local mode make just some calculus about paging if pagination is enabled
                    else if (scope.currentMode == "local") {
                        scope.totalRows = scope.usrData.length;
                        if (scope.usrPageSize) {
                            scope.curPageSize = Math.min(scope.totalRows - scope.curRowIndex, scope.usrPageSize);
                            scope.curPageNum = Math.ceil(scope.curRowIndex / scope.usrPageSize) + 1;
                            scope.totalPages = Math.ceil(scope.totalRows / scope.usrPageSize);
                        }
                        else {
                            scope.curPageSize = scope.totalRows;
                            scope.curPageNum = 1;
                            scope.totalPages = 1;
                        }
                    }
                }

                // this function is used by the repeater to filter data inside the local storage
                scope.pagerFunc = function (value) {
                    if (scope.currentMode == "server") {
                        // in server mode the local storage contains just the current page
                        // so all rows are shown by repeater 
                        return true;
                    }
                    else if (scope.currentMode == "local") {
                        // in local mode filter the only rows in current page
                        if (scope.usrPageSize) {
                            var i = scope.usrData.indexOf(value);
                            return (i < scope.curRowIndex + scope.usrPageSize) && (i >= scope.curRowIndex);
                        }
                        else {
                            return true;
                        }
                    }
                };

                // move to the current page
                scope.gotoPage = function () {
                    scope.curRowIndex = (scope.curPageNum - 1) * scope.usrPageSize;
                    scope.refresh();
                };

                // move to fist page
                scope.gotoFirstPage = function () {
                    scope.curRowIndex = 0;
                    scope.refresh();
                };

                // move to the previous page
                scope.gotoPrevPage = function () {
                    scope.curRowIndex = scope.curRowIndex - scope.usrPageSize;
                    scope.refresh();
                };

                // move to the next page
                scope.gotoNextPage = function () {
                    scope.curRowIndex = scope.curRowIndex + scope.usrPageSize;
                    scope.refresh();
                };

                // move to the last page
                scope.gotoLastPage = function () {
                    scope.curRowIndex = scope.totalRows - ((scope.totalRows % scope.usrPageSize) || scope.usrPageSize);
                    scope.refresh();
                };

                // setting event handlers
                scope.eventHandler = {
                    subscriptions: {},
                    on: function(eventName, handler){
                        if(!handler)
                            return;
                        
                        if(typeof(this.subscriptions[eventName]) == 'undefined')
                            this.subscriptions[eventName] = [];

                        this.subscriptions[eventName].push(handler);
                    }
                };

                // used to emit events
                scope.emitEvent = function(eventName, data, isError) {
                    var eventToEmit = {
                        name: eventName,
                        preventDefault: false,
                        isError: isError || false
                    };
                    if (scope.eventHandler.subscriptions[eventName]) {
                        scope.eventHandler.subscriptions[eventName].forEach(function(h) {
                            h(eventToEmit, data);
                        });
                    }
                    return eventToEmit;
                };

                // user pressed "new row" button
                scope.addRow = function () {
                    if(scope.usrInsertRow === false)
                        return;

                    var newRow = { angryd_state: 'adding' };
                    
                    if(scope.emitEvent('row_inserting', newRow).preventDefault)
                        return;

                    if(typeof(scope.usrInsertRow) != 'function')
                        return;

                    for (var h in scope.headers) {
                        newRow[scope.headers[h]] = '';
                    }
                    if (scope.currentMode == 'local') {
                        scope.usrData.splice(scope.curRowIndex, 0, newRow);
                    }
                    else {
                        scope.usrData.splice(0, 0, newRow);
                    }
                };

                // remove selected rows
                scope.removeRows = function () {
                    // feature disabled or nothing selected
                    if(scope.usrRemoveRows === false || scope.selectedRows.length === 0)
                        return;

                    // event deleted
                    if(scope.emitEvent('row_removing', scope.selectedRows).preventDefault)
                        return;

                    // feature handled by events
                    if(scope.usrRemoveRows === true)
                        return;

                    // defining keys to remove
                    var keysToRemove = [];
                    for (var k in scope.selectedRows) {
                        if (scope.selectedRows[k]) {
                            keysToRemove.push(k);
                            if (scope.currentMode == 'local') {
                                sys.arrayRemove(scope.usrData, function (elem) { return elem[scope.key] == k });
                            }
                        }
                    }
                    // unselect all
                    angular.copy([], scope.selectedRows);
                    if (scope.currentMode == 'server') {
                        // if user provided a function for bulk delete use it
                        if (typeof(scope.usrRemoveRows) == 'function') {
                            scope.usrRemoveRows(keysToRemove)
                                .success(function() {
                                    sys.arrayRemove(scope.usrData, function(elem) { return keysToRemove.indexOf(elem[scope.key]) >= 0 });
                                    scope.refresh();
                                    scope.emitEvent('row_removed', keysToRemove);
                                }); 
                        }
                        // else if user provided a function for single delete use multiple invocation of it
                        else if (typeof(scope.usrRemoveRow) == 'function') {
                            var promises = [];
                            for (var k in keysToRemove) {
                                promises.push(scope.usrRemoveRow(keysToRemove[k]));
                                $q.all(promises)
                                    .then(function () {
                                        sys.arrayRemove(scope.usrData, function (elem) { return keysToRemove.indexOf(elem[scope.key]) >= 0 });
                                        scope.refresh();
                                        scope.emitEvent('row_removed', keysToRemove);
                                    });
                            }
                        }
                    }
                };

                // Initialization
                if (scope.configuredMode == 'auto')
                    scope.currentMode = 'server';
                else
                    scope.currentMode = scope.configuredMode;

                if (scope.usrReload && scope.configuredMode != 'local') {
                    scope.$watch('usrReload', function (newValue, oldValue) {

                        if (newValue) {
                            if (scope.configuredMode == "auto")
                                scope.currentMode = "server";
                            else
                                scope.currentMode = scope.configuredMode;
                            scope.refresh();
                            scope.usrReload = false;
                        }
                    });
                }

                scope.eventHandler.on('row_inserting', scope.usrOnRowInserting);
                scope.eventHandler.on('row_inserted', scope.usrOnRowInserted);
                scope.eventHandler.on('row_updating', scope.usrOnRowUpdating);
                scope.eventHandler.on('row_updated', scope.usrOnRowUpdated);
                scope.eventHandler.on('row_removing', scope.usrOnRowRemoving);
                scope.eventHandler.on('row_removed', scope.usrOnRowRemoved);

                if (scope.configuredMode == "local") {
                    scope.$watch('usrData.length', function () {
                        scope.refresh();
                    });
                }
            }
        };
    }])

    .directive('angrydDatepicker', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attrs, modelCtrl) {
                $(element).datepicker({
                    dateFormat: attrs.angrydDatepicker,
                    //dateFormat: 'dd/mm/yy',
                    onSelect: function (date) {
                        scope.$apply(function () {
                            modelCtrl.$setViewValue(date);
                        });
                    }
                });
            }
        };
    })

    .directive('column', ['angryd.sys', function (sys) {
        return {
            restrict: 'E',
            replace: true,
            scope: true,
            template: function (tElem, tAttrs) {
                var format = sys.parseFormat(tAttrs.format);

                switch (tAttrs.type) {
                    case 'date':
                        var datepickerChunk = "";
                        if (window.hasOwnProperty('jQuery')) {
                            if ($.datepicker) {
                                datepickerChunk = 'angryd-datepicker'
                                if (tAttrs.jqueryDatepickerFormat)
                                    datepickerChunk = datepickerChunk + '="' + tAttrs.jqueryDatepickerFormat + '"';
                            }
                        }

                        return '<td style="width:{{columnWidth(' + format.width + ')}}%; text-align:align">\
                            <span ng-if="!dataRow.angryd_state" style="width:90%">\
                                {{dataRow[name] | date: "' + tAttrs.format + '"}}\
                            </span>\
                            <input style="width:90%;" ng-if="dataRow.angryd_state" type="text" ' + datepickerChunk + ' angryd-date-format="' + tAttrs.dateFormat + '" ng-model="dataRow[name]" angryd-rollbackable></input>\
                        </td>';
                    case 'select':
                        return '<td style="width:{{columnWidth(' + format.width + ')}}%; text-align:' + format.align + '">\
                                <span ng-if="!dataRow.angryd_state" style="width:90%">\
                                    {{translate(dataRow[name])}}\
                                </span>\
                                <select angryd-rollbackable style="width:90%;" ng-model="dataRow[name]" ng-if="dataRow.angryd_state" ng-options="i.' + tAttrs.selectBy + ' as i.' + tAttrs.textBy + ' for i in options">\
                                </select>\
                            </td>';
                    case 'text':
                        return '<td style="width:{{columnWidth(' + format.width + ')}}%; text-align:' + format.align + '">\
                            <span ng-if="!dataRow.angryd_state" style="width:90%;">\
                                {{dataRow[name]}}\
                            </span>\
                            <input style="width:90%;" ng-if="dataRow.angryd_state" type="text" ng-model="dataRow[name]" angryd-rollbackable></input>\
                        </td>';
                    case 'textarea':
                        return '<td style="width:{{columnWidth(' + format.width + ')}}%; text-align:' + format.align + '">\
                            <span ng-if="!dataRow.angryd_state" style="width:90%;">\
                                {{dataRow[name]}}\
                            </span>\
                            <textarea style="width:90%;" ng-if="dataRow.angryd_state" type="text" ng-model="dataRow[name]" angryd-rollbackable></textarea>\
                        </td>';
                    case 'checkbox':
                        return '<td style="width:{{columnWidth(' + format.width + ')}}%; text-align:' +format.align + '">\
                            <span style="width:90%;">\
                                <input ng-if="!dataRow.angryd_state" type="checkbox" ng-model="dataRow[name]" disabled="disabled"></input>\
                                <input ng-if="dataRow.angryd_state" type="checkbox" ng-model="dataRow[name]" angryd-rollbackable></input>\
                            </span>\
                        </td>';
                    case 'password':
                        return '<td style="width:{{columnWidth(' + format.width + ')}}%; text-align:' + format.align + '">\
                            <span ng-if="!dataRow.angryd_state" style="width:90%;">*******</span>\
                            <input ng-if="dataRow.angryd_state" type="password" ng-model="dataRow[name]" style="width:90%;" angryd-rollbackable></input>\
                        </td>';
                    case 'native':
                        var nativeAttributes = '';
                        for (ia in tAttrs) {
                            if ((typeof tAttrs[ia] == 'string') && (tAttrs[ia] != 'type') && (tAttrs[ia] != 'nativeType') && (tAttrs[ia] != 'name')) {
                                nativeAttributes = nativeAttributes + ia + '="' + tAttrs[ia] + '" ';
                            }
                        }

                        return '<td style="width:{{columnWidth(' + width + ')}}%;">\
                            <span ng-if="!dataRow.angryd_state" style="width:90%">{{dataRow[name]}}</span>\
                            <input ng-if="dataRow.angryd_state"  type="' + tAttrs.nativeType + '" ' + nativeAttributes + ' ng-model="dataRow[name]" style="width:90%" angryd-rollbackable></input>\
                        </td>';
                }
            },
            link: function (scope, ele, attrs) {
                sys.applyAttributeSyntax(attrs, sys.columnSyntax);
                var format = sys.parseFormat(attrs.format);

                // get the angryd-directive scope
                var angrydScope = scope.$parent.$parent.$parent;

                scope.name = attrs.name;

                if (attrs.type === 'select') {
                    scope.options = scope.$parent.$parent.$parent.$parent[attrs.options];
                    scope.translate = function (a) {
                        if (attrs.type == 'select') {
                            var elem = scope.options.filter(function (i) {
                                return i[attrs.selectBy] == a;
                            });
                            if (elem[0])
                                return elem[0][attrs.textBy];
                            else return '';
                        }
                        return null;
                    };
                }

                // building the headers
                if (!angrydScope.headerComplete) {
                    if (!angrydScope.headers) {
                        angrydScope.headers = [];
                    }
                    angrydScope.headerComplete = (angrydScope.headers.filter(function (elem) { return elem.name == attrs.name; }).length > 0);
                    if (!angrydScope.headerComplete) {
                        angrydScope.headers.push({ name: attrs.name, label: attrs.label, sort: attrs.sort ? 0 : null, width: format.width, align: format.align });
                        angrydScope.totalWidth = parseInt(angrydScope.totalWidth, 10) + parseInt(format.width, 10);
                    }
                }
            }
        };
    }])

    .directive('actionColumn', ['angryd_skin', 'angryd.sys', '$timeout', function (skin, sys, $timeout) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope:true,
            template: function (elem, tAttrs) {
                var style = {}, classMap = {}, textMap = {};
                if (elem[0].parentNode.attributes.skin) {
                    if (!skin[elem[0].parentNode.attributes.skin.value])
                        throw 'ANGRYD ERROR: skin "' + elem[0].parentNode.attributes.skin.value + '" not found in any angryd-skin file';

                    style = skin[elem[0].parentNode.attributes.skin.value].style;
                    classMap = skin[elem[0].parentNode.attributes.skin.value].classMap;
                    textMap = skin[elem[0].parentNode.attributes.skin.value].textMap;
                }

                var columnFormat = sys.parseFormat(tAttrs.format);
                return '<td style="width:{{columnWidth(' + columnFormat.width + ')}}%; text-align:' + columnFormat.align + '">\
                            <input ng-if="inlineSelectActive" ng-model="selectedRows[dataRow[key]]" ng-change="selectedChange()" type="checkbox"/>\
                            <span ng-if="inlineEditActive && !dataRow.angryd_state" ng-click="dataRow.angryd_state = \'editing\'" class="' + sys.isnull(classMap.editBtn) + '">' + sys.isnull(textMap.edit, '[ Edit ]') + '</span>\
                            <span ng-if="dataRow.angryd_state && showActionButton" ng-click="confirmEdit($index);" class="' + sys.isnull(classMap.confirmBtn) + '">' + sys.isnull(textMap.confirm, '[ OK ]') + '</span>\
                            <span ng-if="dataRow.angryd_state && showActionButton" ng-click="rollback();" class="' + sys.isnull(classMap.revertBtn) + '">' + sys.isnull(textMap.revert, '[ Revert ]') + '</span>\
                            <span ng-if="inlineRemoveActive && !dataRow.angryd_state" ng-click="removeRow($index);" class="' + sys.isnull(classMap.removeBtn) + '">' + sys.isnull(textMap.remove, '[ Remove ]') + '</span>\
                            <span angryd-transclude></span>\
                        </td>';
            },
            link: function (scope, ele, attrs) {
                scope.inlineEditActive = attrs.edit;
                scope.inlineRemoveActive = attrs.remove;
                scope.inlineSelectActive = attrs.select;
                scope.showActionButton = true;

                if (attrs.actionButton) {
                    scope.showActionButton = (attrs.actionButton == "true");
                }

                scope.selectedChange = function () {
                    // ToDo: emit event for selecting row
                }

                scope.rollback = function () {
                    if (scope.dataRow.angryd_state == "adding") {
                        sys.arrayRemove(scope.usrData, function (elem) { return elem[scope.key] == scope.dataRow[scope.key] });
                    }
                    else {
                        scope.dataRow.angryd_state = false;
                        scope.$broadcast('angrydRollback');
                    }
                }

                scope.confirmEdit = function (index) {
                    if (scope.currentMode == "server") {
                        if (scope.usrData[index].angryd_state == "adding") {
                            scope.usrInsertRow(scope.usrData[index])
                                .success(function (data, status, headers, config) {
                                    scope.dataRow.angryd_state = false;
                                    scope.emitEvent('row_inserted', scope.usrData[index]);
                                    scope.refresh();
                                })
                                .error(function (data, status, headers, config) {
                                    scope.emitEvent('row_inserted', data, true);
                                });
                        }
                        else if (scope.usrUpdateRow()) {
                            scope.usrUpdateRow(scope.usrData[index])
                                .success(function (data, status, headers, config) {
                                    scope.dataRow.angryd_state = false;
                                })
                                .error(function (data, status, headers, config) {
                                    scope.$broadcast('angrydRollback');
                                    scope.emitEvent('row_updated', data, true);
                                });
                        }
                        else {
                            scope.dataRow.angryd_state = false;
                        }
                    }
                    else { // client mode
                        scope.dataRow.angryd_state = false;
                    }
                }

                scope.removeRow = function (index) {
                    if (scope.configuredMode == 'local') {
                        scope.usrData.splice(scope.curRowIndex + index, 1);
                        if (scope.curRowIndex >= scope.usrData.length) {
                            scope.gotoPrevPage();
                        }
                    }
                    else {
                        scope.usrRemoveRow(scope.usrData[index][scope.key])
                        .success(function () {
                            scope.usrData.splice(scope.curRowIndex + index, 1);
                            if (scope.usrData.length == 1) //I don't know why 1 and not 0!
                                scope.gotoPrevPage();
                            else
                                scope.refresh();
                        })
                        .error(function(response) {
                            scope.emitEvent('row_removed', response, true);
                        });
                    }
                }

                var format = sys.parseFormat(attrs.format);
                var angrydScope = scope.$parent.$parent.$parent;
                if (!angrydScope.headerComplete) {
                    if (!angrydScope.headers) {
                        angrydScope.headers = [];
                    }
                    angrydScope.headerComplete = (angrydScope.headers.filter(function (elem) { return elem.name == attrs.name; }).length > 0);
                    if (!angrydScope.headerComplete) {
                        angrydScope.headers.push({ name: attrs.name, label: attrs.label, align: format.align });
                        angrydScope.totalWidth = parseInt(angrydScope.totalWidth, 10) + parseInt(format.width, 10);
                    }
                }
            }
        }
    }])

    .directive('customAction', ['angryd.sys', function (sys) {
        return {
            restrict: 'E',
            replace: true,
            template: function (elem, tAttrs) {
                return '<span ng-click="doAction(\'' + tAttrs.action + '\')" class="' + sys.isnull(tAttrs.class) + '">' + sys.isnull(tAttrs.label) + '</span>';
            },
            link: function (scope, ele, attrs) {
                scope.doAction = function (action) {
                    scope.$parent.$parent.$parent.$parent.$parent[action](scope.dataRow);
                }
            }
        }
    }])

    .directive('angrydRollbackable', function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attrs, modelCtrl) {
                modelCtrl.$formatters.push(function (val) {
                    if (modelCtrl.$pristine) {
                        scope.backup = modelCtrl.$modelValue;
                    }
                    return val;
                });
                scope.$on('angrydRollback', function (event, args) {
                    modelCtrl.$setViewValue(scope.backup);
                    modelCtrl.$render();
                });
            }
        }
    })

    .directive('angrydDateFormat', function ($filter) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, modelCtrl) {
                //var valid = false;
                //modelCtrl.$parsers.push(function (value) {
                //    var reg = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
                //    if (value.match(reg))
                //        modelCtrl.$setValidity('date', true);
                //    else
                //        modelCtrl.$setValidity('date', false);
                //});

                modelCtrl.$formatters.push(function (val) {
                    return $filter('date')(val, attrs.angrydDateFormat);
                })
            }
        };
    })

    .directive('angrydEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.angrydEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    });

