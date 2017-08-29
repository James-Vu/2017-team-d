var mongoose = require("mongoose");

var UserTipSchema = new mongoose.Schema({
  userID: { type: String },
  roundNo: { type: Number },
  gameNo: { type: Number },
  teamID: { type: String }
}, { collection: 'userTips' });

mongoose.model('UserTips', UserTipSchema);
