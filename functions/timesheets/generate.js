const pdfmake = require('pdfmake');
const fs = require('fs');
const path = require('path');
var pdf = require('html-pdf');

module.exports = {
  generate_timecard_pdf: (user_id, start_day, end_day, callback) => {

    var options = {
      format: 'A4',
      orientation: "landscape",
      border: {
        top: "2cm",
        right: "2cm",
        bottom: "2cm",
        left: "2cm"
      },
    };

    generate_pdf_string(user_id, (pdf_string) => {

      pdf.create(pdf_string, options).toFile('./timecards/' + user_id + '.pdf', function(err, result) {
        if (err) {
          return callback({
            err
          });
        }

        const filename = path.basename(result.filename)
        console.log('Generated PDF to: ' + filename);
        return callback({
          result: filename
        });
      });

    });

  }
};


function generate_pdf_string(uid, callback) {

  var html_head = '<html> <head> <meta charset="utf8"> <title>Timesheet</title> <style> <style type="text/css">.tg {border: none;}.tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 20px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;}.tg .tg-3k0j{border: none;font-weight:bold;font-size:14px;font-family:"Lucida Console", Monaco, monospace !important;;background-color:#96af4e;color:#ffffff;vertical-align:top}.tg .tg-ds2v{border: none;color:#182319;vertical-align:top}</style> </style> </head> <body>';
  var html_body = ' <table class="tg" cellspacing="0" cellpadding="0"> <tr> <th class="tg-3k0j">Date</th> <th class="tg-3k0j">Day Start</th> <th class="tg-3k0j">Lunch Start</th> <th class="tg-3k0j">Lunch End</th> <th class="tg-3k0j">Day End</th> <th class="tg-3k0j">Hours Worked</th> <th class="tg-3k0j">Comments</th> </tr>';
  var html_footer = '</table></body></html>';

  var databaseReference = FIREBASE_ADMIN.getDatabaseReference();

  // Get schedules from database on startup
  var user_db = databaseReference.child(FIREBASE_USERS_TABLE).child(uid);
  var timesheets_db = databaseReference.child(FIREBASE_ADMIN_PANEL).child(FIREBASE_TIMESHEETS).child(uid);

  user_db.on("value", function(user) {
    user = user.val();
    var html_user_details = '<h1>' + user.first_name + ' ' + user.last_name + '</h1><h4>UID: <em>' + uid + '</em></h4><h4>email: ' + user.email + '</h4>';

    timesheets_db.on("value", function(timesheets) {

      var html_rows = '';

      timesheets.forEach(function(timecard) {
        timecard = timecard.val();

        html_rows += '<tr>';
        html_rows += '<td class="tg-ds2v">' + timecard.date + '</td>';
        html_rows += '<td class="tg-ds2v">' + timecard.start + '</td>';
        html_rows += '<td class="tg-ds2v">' + timecard.lunch_start + '</td>';
        html_rows += '<td class="tg-ds2v">' + timecard.lunch_end + '</td>';
        html_rows += '<td class="tg-ds2v">' + timecard.end + '</td>';
        html_rows += '<td class="tg-ds2v">' + 45 + '</td>';
        html_rows += '<td class="tg-ds2v">' + timecard.comments + '</td>';
        html_rows += '<tr>';

      });

      return callback(html_head + html_user_details + html_body + html_rows + html_footer);
    }, function(errorObject) {
      console.log("The read failed: " + errorObject.code);
      return callback("The read failed: " + errorObject.code);
    });

  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
    return callback("The read failed: " + errorObject.code);
  });



}
