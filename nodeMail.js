var app = angular.module("emailTest", []);
var nodemailer = require('nodemailer');
app.controller("emailController", function($scope, $http) {
  $scope.sendEmail = function() {

    var connection = $http({
        method: "post",
        url: "https://lttc.herokuapp.com/email",
        data:
        {
          "to" : $scope.to,
          "subject" : $scope.subject,
          "text" : $scope.text
        }
      })
    .then(function(response)
    {
      $scope.message = "Email Sent";
      alert($scope.message);
    })
    .catch(function(response) {

    })
    .finally (function(config) {
      alert($scope.message);
    });
  };
});
