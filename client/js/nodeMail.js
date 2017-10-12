var app = angular.module("emailTest", []);

app.controller("emailController", function($scope, $http){
	$scope.message1="";
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
					//$scope.message1 = "Email Sent Successfully";

			})
			.then(function(response)
			{
				$scope.message1 = "Email Sent Successfully";
			})

	};
	$scope.sendAllMail = function() {
		var connection = $http(
			{
				method: "post",
				//url: "http://localhost:3000/emailAll",
        url: "https://lttc.herokuapp.com/emailAll",
			})

		.then(function(response)
			{
        $scope.message2 = "Global Email Sent Successfully";
			})
	};

});
//end controller
