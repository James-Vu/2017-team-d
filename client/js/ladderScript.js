// define our apps name
var app = angular.module("ladderApp", []);

// define our apps controller(s)
app.controller("ladderController", function($scope, $http)
{
	// scope variables
	$scope.teams = null;
	$scope.message = null;
	$scope.name = "bill";
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
	// establish a connection to the url specified and do GET on the url.
	var connection = $http(
		{
			method: "get",
			url: "https://lttc.herokuapp.com/team"
			//url:"http://localhost:3000/team"
		})
		// assign the teams variable with all the response data from the url
		.then(function(response)
		{
			$scope.teams = response.data;
		})

	});
	//end controller
	// send out the appname for use in other scripts
	angular.bootstrap(document.getElementById("App2"), ['ladderApp']);
