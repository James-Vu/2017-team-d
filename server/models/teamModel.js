// Authors: Andrew Kuzminsy, Luke Lo Presti
// Version: v12
// variables & package dependancies
var mongoose = require("mongoose");
/*
   define a Schema for teams. works similar to SQL tables
   tells mongoose & mongoDB the variables which make up a team object
   what types they are, and what to name the collection in the db
*/
var TeamSchema = new mongoose.Schema({
	_id: { type: String },
	teamID: { type: String },
	teamName: { type: String },
	position: { type: Number },
	gamesPlayed: { type: Number },
	gamesWon: { type: Number },
	gamesLost: { type: Number },
	gamesDrawn: { type: Number },
	pointsFor: { type: Number },
	pointsAgainst: { type: Number },
	percentage: { type: Number },
	points: { type: Number },
	isEliminated: { type: Boolean}
}, { collection: 'team' });

// create a model out of our schema named Team.
module.exports = mongoose.model('Team', TeamSchema);
