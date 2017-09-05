var app = angular.module("emailTest", []);

app.controller("emailController", function($scope, $http){

	$scope.sendMail = function() {

		var connection = $http(
			{
				method: "post",
				//url: "http://localhost:3000/email",
        url: "https://lttc.herokuapp.com/email",
				data:
					{
						"to": $scope.to,
						"subject": $scope.subject,
						"text": $scope.text
					}
			})

		.then(function(response)
			{
        $scope.message = "Success";
        $scope.to = null;
				$scope.subject = null;
				$scope.text= null;
			})
      .catch(function(response)
			{
			})

		.finally (function(config)
			{
			});
	};

});
//end controller
