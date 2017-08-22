var app = angular.module("userApp", []);

app.controller("userController", function($scope, $http)
	{
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
		var connection = $http(
		{
			method: "get",
			//url: "https://lttc.herokuapp.com/user"
			url:"http://localhost:3000/user"
		})

		.then(function(response)
		{
			response.data.forEach(function(item) {
				item.steps = null;
			});
			$scope.users = response.data;
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
	app.controller("userTipController", function($scope, $http)
		{
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
			var connection = $http(
			{
				method: "get",
				url: "https://lttc.herokuapp.com/userTips"
				//url:"http://localhost:3000/userTips"
			})

			.then(function(response)
			{
				response.data.forEach(function(item) {
					item.steps = null;
				});
				$scope.userTips = response.data;
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
