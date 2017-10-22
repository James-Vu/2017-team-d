// Authors: Andrew Kuzminsy, Luke Lo Presti
// Version: v12
// variables & package dependancies
var mongoose = require("mongoose");
/*
   define a Schema for userTips. works similar to SQL tables
   tells mongoose & mongoDB the variables which make up a userTips object
   what types they are, and what to name the collection in the db
*/
var UserTipSchema = new mongoose.Schema({
  username: { type: String },
  roundNo: { type: Number },
  gameNo: { type: Number },
  teamID: { type: String }
}, { collection: 'userTips' });

// create a model out of our schema named UserTips.
mongoose.model('UserTips', UserTipSchema);
