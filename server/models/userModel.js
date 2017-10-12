var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var validate = require('mongoose-validator');
var uniqueValidator = require("mongoose-unique-validator");


var emailValidator = [
  validate({
    validator: 'isEmail',
    message: "Invalid Email Address"
  })
];


var UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please enter a Username"],
    unique: [true, "Username already exists"],
    minlength: [1, "Username must be at least 1 character"]
  },
  password: {
    type: String,
    required: [true, "Please enter a Password"],
    minlength: [1, "Password must be at least 1 characters"]
  },
  firstname: {
    type: String,
    required: [true, "Please enter a First Name"]
  },
  lastname: {
    type: String,
    required: [true, "Please enter a Last Name"]
  },
  email: {
    type: String,
    required: [true, "Please enter an Email Address"],
    unique: [true, "Email already exists"],
    validate: emailValidator
  },
  dob: {
    type: Date,
    required: [true, "Please enter a Date Of Birth"]
  },
  gender: {
    type: String,
    required: [true, "Please select a Gender"]
  },
  favouriteteam: {
    type: String,
    required: [true, "Please select a Team"]
  }
});

UserSchema.plugin(uniqueValidator, { message: '{PATH} already exists'});

// encrypt the password
UserSchema.methods.generateHash = function(password){
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
}

// compare encrpted passwords
UserSchema.methods.validPassword = function(password){
  return bcrypt.compareSync(password, this.password);
}

// before saving, encrypt
UserSchema.pre('save', function(done){
  this.password = this.generateHash(this.password);
  done();
})

module.exports = mongoose.model('User', UserSchema);
