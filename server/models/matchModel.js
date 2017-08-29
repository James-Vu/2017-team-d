var mongoose = require("mongoose");

var MatchSchema = new mongoose.Schema({
  roundNo: { type: Number },
  gameNo: { type: Number },
  matchDate: { type: Date },
  matchLocation: { type: String },
  homeTeam: { type: String },
  awayTeam: { type: String },
  homeOdds: { type: Number },
  awayOdds: { type: Number }
}, { collection: 'match' });

mongoose.model('Match', MatchSchema);
