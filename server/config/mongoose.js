var mongoose = require("mongoose");
var fs = require('fs');

mongoose.connect('mongodb://teamd2017project:testpassword@cluster0-shard-00-00-a0wld.mongodb.net:27017,cluster0-shard-00-01-a0wld.mongodb.net:27017,cluster0-shard-00-02-a0wld.mongodb.net:27017/tippingdb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');


require('./../models/userModel.js');
require('./../models/teamModel.js');
require('./../models/matchModel.js');
require('./../models/userTipModel.js');
// var models_path = __dirname + '/../models';
//
// fs.readdirSync(models_path).forEach(function(file){
//   if(file.indexOf('.js') > 0){
//     require(models_path + '/' + file);
//   }
// })
