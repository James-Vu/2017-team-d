// Authors: Andrew Kuzminsy, Luke Lo Presti
// Version: v12
// define the name of our app
var app = angular.module("emailTest", []);

// define the apps controller
app.controller("emailController", function($scope, $http){
	// scope variables & functions
	$scope.message1="";
	$scope.sendMail = function() {
		// make a connection to the url, posting data to it.
		var connection = $http(
			{
				method: "post",
				//url: "http://localhost:3000/email",
				url: "https://lttc.herokuapp.com/email",
				// assign the scope variables with data binded from the HTML form.
				data:
				{
					"to": $scope.to,
					"subject": $scope.subject,
					"text": $scope.text
				}

			})
			// if the email is sent successfully,
			// we then print out the message1 variable to our html page
			.then(function(response)
			{
				$scope.message1 = "Email Sent Successfully";
			})

		};
		// make a connection to the url, posting data to it.
		// sends an email to every registered users email
		// reminding them to tip this week.
		$scope.sendAllMail = function() {
			var connection = $http(
				{
					method: "post",
					//url: "http://localhost:3000/emailAll",
					url: "https://lttc.herokuapp.com/emailAll",
				})
				// if the email is sent successfully,
				// we then print out the message2 variable to our html page
				.then(function(response)
				{
					$scope.message2 = "Global Email Sent Successfully";
				})
			};

		});
		//end controller
