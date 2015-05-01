# Angryd

_An AngularJS directive for declarative creation of data tables_

## Install Demo (from bash)
```bash
mkdir angryd
git clone https://github.com/lelettrone/angryd.git angryd
cd angryd
bower install
open demo/demo.html
``` 

## List of Live examples on CodePen
- Bind data to the Angryd directive: [codepen-data-binding]
- Add pagination feature to the grid: [codepen-data-pagination]
- A look at nude Angryd table: [codepen-no-style]
- Use the bootstrap skin: [codepen-bootstrap-skin]
- Editing data: [jcodepen-editing]
- Sorting data: [codepen-sorting]
- Server side data: [codepen-server-data]

## Features description

#### Declarative syntax

The primary purpose of Angryd is the real isolation between table view and logic in pure AngularJS style. This is an example of using the directive in your view. 

```html
<angryd data="myData">
    <column name="firstName" label="First Name" type="text"></column>
    <column name="lastName" label="Last Name" type="text"></column>
    <column name="username" label="Username" type="text"></column>
    <column name="online" label="On-Line" type="checkbox"></column>
</angryd>
```

####  Three data strategies: _local_, _server_ and _auto_

You have two way to show your data inside an Angryd grid. The simple way is to put your json data into a scope variable and bind this variable to the directive through the `data` attribute. This make sense just when your data is small and you don't want a server side binding complication.

The other way is to define methods to _get_, _update_ and _remove_ data in your controller. This methods will be _comunicated_ to angryd through the `get`, `update-row`, `remove-row` and `remove-rows` attributes. In this case you have to set the attribute `mode="server"` also.

Actually there is a third way activable by defining the attribute `mode="auto"`. This mode is identical to the _server_ mode except that Angryd will act like the _local_ mode just when the entire data source contains 100 rows or less.

#### In-line editing

Angryd allow editing data directly from it's interface by writing inside cells, selecting, adding and remove rows.

#### Pagination

Angryd can handle pagination of data though a predefined pager inside the footer.

#### Sorting

If you mark some or all columns as _sortable_ Angryd will transform respective headers to toggle buttons that will switch between ascending and descending order. Sorting by multiple field is permitted too.

#### Customizable in-line actions

You can define custom buttons and relative actions to execute for each row. 

#### Customizable skin

Angryd directive, by itself, will renderize more or less as a simple html table. Using a predefined or custom _skin_ file you can adapt it to your site style.  

## Include Angryd in your project

Include **angryd.js** and **angryd-basic-skin.js** in your app

```html
<script src="scripts/angryd.js"></script>
<script src="scripts/angryd-basic-skin.js"></script>
```

Declare dependency in your main module

```JavaScript
angular.module('myApp', ['angryd'])
```

## Bind angryd directive to a data source

Define some data in your controller.

```JavaScript
    $scope.myData = [{ 
        firstName: "Paul", 
        lastName: "Borek", 
        username: "p.borek", 
        online: false 
    }, { 
        firstName: "Thomas", 
        lastName: "Collat", 
        username: "t.collat", 
        online: true 
    }, { 
        firstName: "Linda", 
        lastName: "White", 
        username: "l.white", 
        online: false 
    }, { 
        firstName: "Jennifer", 
        lastName: "Berkman", 
        username: "j.berkman", 
        online: true 
    }, { 
        firstName: "Ricky", 
        lastName: "Choi", 
        username: "r.choi", 
        online: false 
    }];
```

Bind your data to an angryd directive in your view indicating the data source and the properties to show in columns

```html
<angryd data="myData" skin="basic">
    <column name="firstName" label="First Name" type="text"></column>
    <column name="lastName" label="Last Name" type="text"></column>
    <column name="username" label="Username" type="text"></column>
    <column name="online" label="On-Line" type="checkbox"></column>
</angryd>
```

Try angryd data binding on codepen: [codepen-data-binding]

## Data pagination

In real world apps, data can be larger than few rows so you may want to split it in pages.

Change previous example by adding the **`page-size`** attribute to the angryd directive and put more data in the data source to see the effect.

```html
<angryd data="myBigData" skin="basic" page-size="10">
```

A footer with paging controls will be added to your table.
Because data is stored locally, pagination is automatically handled for you effortlessly.

Try data pagination on codepen [codepen-data-pagination] **UNDER CONSTRUCTION**

## Style

Angryd directive comes without any style. This means that if you don't import any skin file and you don't include the skin attribute, you get litte more than just a styleless html table.
All feature can be activated but the result is an ugly sight. User interface is composed by only english word and some ASCII symbol.

See an ugly angryd table without style on codepen [codepen-no-style] **UNDER CONSTRUCTION**

Skin files can contains css and text that can transform grid appereance. This give you several choice for customization: you can use pure CSS, you can download a skin file from this site and modify it, or you can write your skin file from scratch.

See the Customization section for more details on creating custom skins.

The basic skin that we used at the beginning is a really simple skin that not use any image and not depend by any other component. It's provided for demo purpouse and the result is just a little bit more pleasant compared to the one without skin.

If you use Bootstrap in your project you can take advantage of the predefined bootstrap-skin. This skin uses the bootstrap glyphicons for buttons and some other refinement.
To see it in action import the skin file and refer it within the skin attribute.

```html
<script src="scripts/angryd-bootstrap-skin.js"></script>
```

Just for feature discovering purpose, add also the `heading` attribute paying attention to double quoting: `heading="'Users'"`.
This will add an header and a title to the grid.

```html
<angryd data="myBigData" page-size="10" heading="'Users'" skin="bootstrap" >
```

Try the bootstrap skin on codepen [codepen-bootstrap-skin] **UNDER CONSTRUCTION**

## Editing data

Angryd provide a simple inline data editing feature. To activate it add an action-column element among columns and set the attributes select, edit and remove to "true".
In addition add attributes footer-remove and footer-insert to the angryd element, both setted to true.

```html
<angryd data="myBigData" key="id" heading="'Users'" page-size="10" skin="bootstrap" footer-insert="true" footer-remove="true">
    <action-column name="actions" edit="true" remove="true"></action-column>
    <column name="firstName" label="First Name" type="text"></column>
    <column name="lastName" label="Last Name" type="text"></column>
    <column name="username" label="Username" type="text"></column>
    <column name="online" label="On-Line" type="checkbox" ></column>
</angryd>
```

Now you can select, create, edit and remove rows.
Selection is maintained cross pages and you can view current selection lenght in the right side of the footer.
Created rows are inserted on top of current page but if sorting is active they will be repositioned on first page changing. All changes are done directly to the data source unless you discard it.

Try editing data feature on codepen [codepen-editing]

## Custom actions on row data

In addition to _select_, _edit_, and _remove_ buttons you can define your custom actions that can be executed on each row.
For example you may need a button that open a detailed view of the row and another button that make some other stuff on the row.

To define you custom action replace the action-column attribute of the above example with this one:

```html
<action-column name="actions" label="Actions" edit="true" remove="true" select="true">
    <custom-action 
        action="showDetail" class="glyphicon glyphicon-zoom-in btn green">
    </custom-action>
    <custom-action 
        action="doSomeStuff" class="glyphicon glyphicon-download btn brown">
    </custom-action>
</action-column>
```

Then, in the controller, define the actions you want to bind to the buttons, for example:

```JavaScript
$scope.showDetail = function(row) {
    alert('Row detail: '+ JSON.stringify(row));
};
$scope.doSomeStuff = function(row) {
    alert("Do something with " + row.firstName + " "+row.lastName);
};
```
This methods will be invoked with the entire row object as argument.

## Sorting

To activate sorting feature, add `sort="true"` attribute in the columns you want to sort by.

```html
<column name="firstName" label="First Name" type="text" sort="true"></column>
<column name="lastName" label="Last Name" type="text" sort="true"></column>
```

You can sort your data by multiple clicks on column headers.
First click on a column will activate ascending sort, second click will switch to descending sort, third click will deactivate sort. Inside the footer you can see on which column you are currently sorting by.

Try editing data feature on codepen [codepen-sorting]

## Loading data from server

What we've seen until now is almost all that Angryd can do with your minimal effort and when data is entirely stored on the client-side.
Most probably your scenarios is a bit more complex, your data is too big to be handled by the client so you would like to get from server just a page of data at a time.
In that case you need to instruct angryd on how ask to the server the right portion of data depending on page number and sorting criteria.

``` html
<angryd data="myGrid.data"
        key="id"
        heading="myGrid.title"
        page-size="10"
        mode="server"
        reload="myGrid.reload"
        skin="bootstrap"
        get="getServerData"
        count="countServerData"
        remove-row="removeRow"
        remove-rows="removeRows"
        insert-row="insertServerData"
        update-row="updateServerData"
        footer-remove="true"
        footer-insert="true">
    <action-column 
        name="actions" label="Actions" edit="true" remove="true" select="true" >
    </action-column>
    <column name="firstName" label="First Name" type="text" sort="true">
    </column>
    <column name="lastName" label="Last Name" type="text" sort="true">
    </column>
    <column name="username" label="Username" type="text">
    </column>
    <column 
        name="sex" label="Sex" type="select" options="sex" 
        select-by="id" text-by="description">
    </column>
    <column 
        name="birthdate" label="Date of birth" type="date" sort="true" 
        format="dd/MM/yyyy" jquery-datepicker-format="dd/mm/yy">
    </column>
    <column name="age" label="Age" type="native" native-type="number" min="0" max="120">
    </column>
</angryd>
```

As you can see the real difference with local data source is the presence of more attribute in the angryd tag. What follows is a description of the individual fieldsLet's see briefly what they are, for detailed information see the reference section.

##### key

Is the name of a field in your data that will be used as identity. The identity field will be used to identify which row to modify or delete.

##### reload

Make this field point to a variable in your controller and set that variable to true when you want get or refresh your data. It will be then automatically resetted to false. It may sound strange but imagine you have a search form and you need to show result in an angryd grid. Since angryd handle indipendently the request to the server you need a way to command angryd to get data.

##### get

Is the method that invoke server to get a subset of data. It take three parameters needed for pagination pourpose and return the rows.

##### count

This method return the number of row in the entire record set.

##### remove-row

This method take one parameter that is the id of the record to remove.

##### remove-rows

Like remove-row but take as parameter an array of id to remove. You can define one of the two method or both. Angryd will adapt oneself. I raccomend to define at least the array version and optionally the single id version.

##### insert-row

Take one parameter that is a new row to pass to the server for insert.

##### update-row

Take one parameter tha is the record to update.

##### footer-remove

Set it to true if you want to allow user to remove the selected rows.

##### footer-insert

Set it to true if you want to allow user to insert new rows.

Try server data binding on codepen: [codepen-server-binding]

## Handling Events
**DOCUMENT UNDER CONSTRUCTION**

[e-mail me]: mailto:longo.emanuele@gmail.com
[codepen-data-binding]: http://codepen.io/lelettrone/pen/BNNYRJ?editors=101
[codepen-data-pagination]: http://codepen.io/lelettrone/pen/XbbZRv?editors=101
[codepen-no-style]: http://codepen.io/lelettrone/pen/vOOdZx?editors=101
[codepen-bootstrap-skin]: http://codepen.io/lelettrone/pen/Nqqygz?editors=101
[codepen-editing]: http://codepen.io/lelettrone/pen/eNNVRa?editors=101
[codepen-sorting]: http://codepen.io/lelettrone/pen/xGGYXG?editors=101
[codepen-server-data]: http://codepen.io/lelettrone/pen/RPPQLV?editors=101