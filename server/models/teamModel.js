var mongoose = require("mongoose");

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

module.exports = mongoose.model('Team', TeamSchema);
