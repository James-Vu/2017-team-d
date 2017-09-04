var app = angular.module("emailTest", []);

app.controller("emailController", function($scope, $http){
  $scope.message = "empty";

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
			})
      .catch(function(response)
			{

			})

		.finally (function(config)
			{
				alert($scope.to);
        alert($scope.message);
			});
	};

});
//end controller
