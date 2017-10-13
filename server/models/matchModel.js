// Authors: Andrew Kuzminsy, Luke Lo Presti
// Version: v12
// variables & package dependancies
var mongoose = require("mongoose");
/*
   define a Schema for matches. works similar to SQL tables
   tells mongoose & mongoDB the variables which make up a match object
   what types they are, and what to name the collection in the db
*/
var MatchSchema = new mongoose.Schema({
  roundNo: { type: Number },
  gameNo: { type: Number },
  matchDate: { type: Date },
  matchLocation: { type: String },
  homeTeamID: { type: String },
  awayTeamID: { type: String },
  homeScore: {type: String },
  awayScore: {type: String },
  homeOdds: { type: Number },
  awayOdds: { type: Number }
}, { collection: 'match' });

// create a model out of our schema named Match.
mongoose.model('Match', MatchSchema);
