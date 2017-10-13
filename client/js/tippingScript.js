// insert ladderScript.js (ladderApp) as a dependancy
var app = angular.module("ladderApp");
// define the name of our app and its dependancies
var app = angular.module('tippingApp', ['ladderApp'])

// TIPPING Controller
app.controller("tippingController", function($scope, $http)
{
	// instantiate scope variables & functions
	$scope.roundNo = 1;

	$scope.matches = null;
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
	// make a connection to the url
	var connection = $http(
		{
			method: "get",
			url: "https://lttc.herokuapp.com/match?roundNo=" + $scope.roundNo
			//url: "http://localhost:3000/match?roundNo=" + $scope.roundNo
		})
		// if successful, get everything in the match collection
		// and assign it to our match scope variable
		.then(function(response)
		{
			response.data.forEach(function(item) {
				item.steps = null;
			});
			$scope.matches = response.data;
		})

	// watch the roundNo variable, performing a get request if it changes.
	$scope.$watch('roundNo',function(newVal,oldVal){
		var connection = $http(
			{

				method: "get",
				url: "https://lttc.herokuapp.com/match?roundNo=" + $scope.roundNo
				//url: "http://localhost:3000/match?roundNo=" + $scope.roundNo
			})
			// if successful, get all the data required and assign it to matches.
			.then(function(response)
			{
				response.data.forEach(function(item) {
					item.steps = null;
				});
				$scope.matches = response.data;
			})
		});
	});
	// END OF TIPPING CONTROLLER
	// USER SESSION CONTROLLER
	app.controller("userLogController", function($scope, $http)
	{
		// get the url, assigning the data variable to the response from the url

		$http.get("https://lttc.herokuapp.com/tippingUser").
		then(function(response) {
			$scope.data = response.data;
		})
		/*
		// localhost version
		$http.get("http://localhost:3000/tippingUser").
		then(function(response) {
		$scope.data = response.data;
	})
	*/

});
// END OF USER SESSION CONTROLLER
