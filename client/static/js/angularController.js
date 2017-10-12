logApp.controller('usersController', ['userFactory', function(userFactory){
  console.log("users controller loaded");

  if(userFactory.loggedUser._id){
    redirect('tipping.html');
  }
  else{
    console.log("user is not logged in");
    //$location.url('/');
  }

  var self = this;
  self.validationErrors;

  this.register = function(){
    self.validationErrors = {};
    console.log(self.regUser);
    userFactory.register(self.regUser, function(data){
      console.log(data);
      alert("Register successful");
      window.location.replace('login.html');
    }, function(error){
      console.log("ERROR: ", error);
      self.validationErrors = error.data.errors;
    })
  }

  this.login = function(){
    self.validationErrors = {};
    console.log(self.logUser);
    userFactory.login(self.logUser, function(data){
      console.log(data);
      //alert("Log in successful");
      window.location.replace('../tipping.html');
      userFactory.setLogin(data);
    }, function(error){
      console.log("ERROR: ", error);
      self.validationErrors = error.data.data.errors;
    })
  }
}])
