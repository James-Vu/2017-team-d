// This file handles all the database connecting we need to do.
var mongoose = require('mongoose');
// Make a team schema, with an _id, isElimianted and tell mongoose the collection name = 'team' not 'teams'
var Match = new mongoose.Schema({
  roundNo: { type: Number },
  gameNo: { type: Number },
  matchDate: { type: Date },
  matchLocation: { type: String },
  homeTeam: { type: String },
  awayTeam: { type: String },
  homeOdds: { type: Number },
  awayOdds: { type: Number }
}, { collection: 'match' });

var User = new mongoose.Schema({
  _id: { type: String },
  password: { type: String },
  email: { type: String },
  favouriteTeam: { type: String },
  currentWins: { type: Number },
  currentLosses: { type: Number },
  currentDraws: { type: Number },
  userGroup: { type: String },
  emailOptOut: { type: Boolean }
}, { collection: 'user' });

var UserTips = new mongoose.Schema({
  userID: { type: String },
  roundNo: { type: Number },
  gameNo: { type: Number },
  teamID: { type: String }
}, { collection: 'userTips' });

var Team = new mongoose.Schema({
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

// Makes a model out of our schemas
mongoose.model('Match', Match);
mongoose.model('User', User);
mongoose.model('UserTips', UserTips);
mongoose.model('Team', Team);
// We then connect to our mongoDB called mongoUsers
mongoose.connect('mongodb://teamd2017project:testpassword@cluster0-shard-00-00-a0wld.mongodb.net:27017,cluster0-shard-00-01-a0wld.mongodb.net:27017,cluster0-shard-00-02-a0wld.mongodb.net:27017/tippingdb?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin');
// This is all changeable when we connect to a proper database.
//mongoose.connect('mongodb://localhost/tippingdb');
mongoose.Promise = global.Promise; // fixes a warning message
console.log(' We are now connected ');
