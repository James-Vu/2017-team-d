var app = angular.module("ladderApp"); // insert ladderScript.js (ladderApp) as a dependancy
var app = angular.module('tippingApp', ['ladderApp'])

//MATCHES
app.controller("tippingController", function($scope, $http)
	{
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
		var connection = $http(
		{

			method: "get",
			url: "https://lttc.herokuapp.com/match?roundNo=" + $scope.roundNo
			//url: "http://localhost:3000/match?roundNo=" + $scope.roundNo
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


		$scope.$watch('roundNo',function(newVal,oldVal){
			var connection = $http(
			{

				method: "get",
				url: "https://lttc.herokuapp.com/match?roundNo=" + $scope.roundNo
				//url: "http://localhost:3000/match?roundNo=" + $scope.roundNo
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
	});
	//end controller
