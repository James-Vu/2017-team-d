// Create a SMTP transport object
var nodemailer = require('nodemailer');
var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports = {
  // This function gets all the users from the DB who wish to receive email alerts
  seeUsersWithOpt: function (req, res, next) {
    User.find({ emailOptOut: false }, function (err, docs) {
      if (err) {
        res.status(504);
        res.end(err);
      } else {
        for (var i = 0; i < docs.length; i++) {
         console.log('Opt Name :', docs[i]._id, ', Opt Fav:', docs[i].favouriteteam);
        }
        res.end(JSON.stringify(docs));
      }
    });
  },

  // This function sends emails (just a post req atm)
  sendEmail: function(req, res) {
    var mailman = req.body; // gets the content of the post (TO, SUBJECT, TEXT)

    console.log("TO: " + mailman.to);
    console.log("SUBJECT: " + mailman.subject);
    console.log("TEXT: " + mailman.text);

    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: "lttcnoreply@gmail.com",
        pass: "Vanberk234"
      }
    });

    var mailOptions = {
      from: "LTTC ADMIN <lttcnoreply@gmail.com>",
      to: mailman.to,
      subject: mailman.subject,
      text: mailman.text
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    transporter.close();
  }
}
/*
sendEmail: function (req, res) {
// SET NODEMAILER_USER='lttcnoreply@gmail.com' SET NODEMAILER_PASS='Vanberk234' node app.js
var mailman = req.body;
console.log("TO: " + mailman.to);
console.log("SUBJECT: " + mailman.subject);
console.log("TEXT: " + mailman.text);

var transporter = nodemailer.createTransport("SMTP", {
    service: 'gmail',
    auth: {
        user: 'lttcnoreply@gmail.com',
        pass: 'Vanberk234'
      }
  });

  var mailOptions = {
      from: 'lttcnoreply@gmail.com',
      to: mailman.to,
      subject: mailman.subject,
      text: mailman.text
    };
    console.log(mailOptions);
    console.log("Nothin sent yet");
    transporter.sendMail(mailOptions, function(error, info) {
      console.log("IM TRYING TO SEND AN EMAIL");
      if(error) {
        console.log(error);
      } else {
        console.log("email sent: " + info.response);
      }
    });
  }
*/
