var app = angular.module("tippingApp", []);

app.controller("tippingController", function($scope, $http)
	{
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
		var connection = $http(
		{
			method: "get",
			url: "https://lttc.herokuapp.com/match"
			//url: "http://localhost:3000/match"
		})

		.then(function(response)
		{
			response.data.forEach(function(item) {
				item.steps = null;
			});
			$scope.matches = response.data;
		})

		.catch(function(response)
		{
			// It is OK not to take any action here because it would be
			// clear to the user if the list operation is succesfull or not
		})

		.finally(function(config)	// induce a syntax error here and see what happens
		{
			// It is OK not to take any action here because it would be
			// clear to the user if the list operation is succesfull or not
		});


	});
	//end controller
