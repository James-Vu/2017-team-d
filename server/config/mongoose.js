// Authors: Andrew Kuzminsy, Luke Lo Presti
// Version: v12
// package dependancies
var mongoose = require("mongoose");
// use mongoose to connect to our database (mongoDB Atlas)
mongoose.connect('mongodb://teamd2017project:testpassword@cluster0-shard-00-00-a0wld.mongodb.net:27017,cluster0-shard-00-01-a0wld.mongodb.net:27017,cluster0-shard-00-02-a0wld.mongodb.net:27017/tippingdb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');

// dependancies
require('../models/userModel.js');
require('../models/teamModel.js');
require('../models/matchModel.js');
require('../models/userTipModel.js');
