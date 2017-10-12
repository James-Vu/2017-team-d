// Create a SMTP transport object
var nodemailer = require('nodemailer');
var mongoose = require("mongoose");
var User = mongoose.model("User");

module.exports = {
  // This function sends broadcasts, useful for customized emails from an admin.
  // eg. "Merry Christmas USERS!"
  sendBroadcast: function (req, res) {
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
      to: mailman.to, // This can be automated.
      subject: mailman.subject, // Customized
      text: mailman.text // Customized
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('EMAIL SENT: ' + info.response);
        res.send("Email Sent Successfully");
      }
    });
    transporter.close();
  },
  // Sends Tipping Reminders to All users whom are opted for emails.
  sendEmail: function(req, res) {
    //var mailman = req.body; // gets the content of the post (TO, SUBJECT, TEXT)
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: "lttcnoreply@gmail.com",
        pass: "Vanberk234"
      }
    });

    // Get ALL users in the db, send them an email
    // TODO: CHANGE THE QUERY SO IT ONLY GETS THOSE WITH .optIN
    User.find({}, function (err, docs) {
      if (err) {
        res.status(504);
        res.end(err);
      }
      else {
        // For every user, get the email, assign a subject & message
        for (var i = 0; i < docs.length; i++) {
          var mailOptions = {
            from: "LTTC ADMIN <lttcnoreply@gmail.com>",
            to: docs[i].email,
            subject: 'Weekly Tipping Reminder',
            text: 'Dont forget to tip this week!, if you already have, please ignore this message.'
          };
          // Then send an email to the user.
          transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
              console.log(error);
            }
            else {
              console.log('Email sent: ' + info.response);
            }
          });
        }
        res.end(JSON.stringify(docs));
      }
    });
    transporter.close();
  }
}
