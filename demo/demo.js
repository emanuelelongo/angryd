angular.module('demoApp', ['angryd'])
	.controller('demoController', function($scope) {	
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
	
	console.log("demoController loaded");
});