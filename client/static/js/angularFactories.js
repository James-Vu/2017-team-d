// Authors: Andrew Kuzminsy, Luke Lo Presti
// Version: v12
logApp.factory('userFactory', function($http){
  console.log("user factory loaded");
  var factory = {};

  factory.loggedUser = {};

  // register function
  factory.register = function(user, callback, errorCallback){
    console.log(user);
    $http.post('/users', user).then(callback, errorCallback);
  }
  // login function
  factory.login = function(user, callback, errorCallback){
    console.log(user);
    $http.post('/login', user).then(callback, errorCallback);
  }
  factory.setLogin = function(user){
    factory.loggedUser = user;
  }
  return factory;
})
