var mongoose = require("mongoose");

var TeamSchema = new mongoose.Schema({
	_id: { type: String },
	position: { type: Number },
	gamesPlayed: { type: Number },
	gamesWon: { type: Number },
	gamesDrawed: { type: Number },
	gamesLost: { type: Number },
	points: { type: Number },
	percentage: { type: Number },
	isEliminated: { type: Boolean}
}, { collection: 'team' });

mongoose.model('Team', TeamSchema);
