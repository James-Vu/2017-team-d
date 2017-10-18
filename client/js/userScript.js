// Authors: Andrew Kuzminsy, Luke Lo Presti
// Version: v12
// insert nodeMail.js (emailTest) as a dependancy
var app = angular.module("emailTest");
// define the name of our app and its dependancies
var app = angular.module("userApp", ['emailTest']);

// USER Controller
app.controller("userController", function($scope, $http)
{
	// instantiate scope variables & functions
	$scope.users = null;
	$scope.message = null;
	$scope.filterString = '';
	$scope.sortByName = false;
	$scope.sortOrder = '';
	$scope.setSortOrder = function()
	{
		if($scope.sortByName)
		{
			$scope.sortOrder = 'name';
		}
		else
		{
			$scope.sortOrder = '';
		}
	}
	// connect to the url, getting the data
	var connection = $http(
		{
			method: "get",
			url: "https://lttc.herokuapp.com/users"
			//url:"http://localhost:3000/users"
		})
		// if successful, assign the response data to users variable
		.then(function(response)
		{
			response.data.forEach(function(item) {
				item.steps = null;
			});
			$scope.users = response.data;
		})
	});
	//END USER Controller
	// USERTIP Controller
	app.controller("userTipController", function($scope, $http)
	{
		// instantiate scope variables & functions
		$scope.userTips = null;
		$scope.message = null;
		$scope.filterString = '';
		$scope.sortByName = false;
		$scope.sortOrder = '';
		$scope.setSortOrder = function()
		{
			if($scope.sortByName)
			{
				$scope.sortOrder = 'name';
			}
			else
			{
				$scope.sortOrder = '';
			}
		}
		// connect to the url, getting the data
		var connection = $http(
			{
				method: "get",
				url: "https://lttc.herokuapp.com/userTips"
				//url:"http://localhost:3000/userTips"
			})
			// if successful, assign the response data to userTips variable
			.then(function(response)
			{
				response.data.forEach(function(item) {
					item.steps = null;
				});
				$scope.userTips = response.data;
			})
		});
		// END USERTIP Controller
		// USER SESSION Controller
		app.controller("userLogController", function($scope, $http)
		{
			// get the url, assigning the data variable to the response from the url

			$http.get("https://lttc.herokuapp.com/tippingUser").
			then(function(response) {
			$scope.data = response.data;
		})

		// localhost version
/*
		$http.get("http://localhost:3000/tippingUser").
		then(function(response) {
			$scope.data = response.data;
		})
*/
	});
	// END USER SESSION Controller
