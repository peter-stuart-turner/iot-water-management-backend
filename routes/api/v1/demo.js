const router = require('express').Router();
const firebase = require('firebase');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

const fb_constant = require('../../../utils/firebase_constants');
const scheduler_constants = require('../../../utils/scheduler_constants');
const firebaseInit = require('../../../firebase/firebase');

const scheduler = require('../../../functions/scheduler/scheduler');
const system = require('../../../functions/systems/system');
const qrGen = require('../../../security/QR/QR_Generator');

const generator = require('../../../functions/timesheets/generate');

const schedulers_table = FIREBASE_SYSTEMS_SCHEDULER_TABLE;
const systems_table = FIREBASE_SYSTEMS_TABLE;


/*
 * Generate a system QR code
 */
router.get('/generateqr/:system_id', function(req, res, next) {
  const system_id = req.params.system_id;

  const qrGenerator = new qrGen();
  var qr_test_code = qrGenerator.getNewCode(system_id);
  qrGenerator.saveCodeToFile(system_id);

  return res.status(200).json({
    success: true,
    message: "Generated QR code"
  });
});


/*
 * Activate a system
 */
router.post('/activate', function(req, res, next) {
  const data = JSON.parse(req.body.data);
  const hash_id = data.hashed_id;
  const user_id = data.user_id;

  system.activate_system(hash_id, user_id, (result) => {
    if (result.success) {
      return res.status(200).json(result);
    } else if (!result.success) {
      return res.status(404).json(result);
    } else {
      return res.status(404).json(result);
    }
  });
});


/*
 * Get systems for a user
 */
router.get('/systems/:user_id', function(req, res, next) {
  const user_id = req.params.user_id;

  var options = {
    path: systems_table,
    id: null,
    raw_data: true,
    get_all_children: true,
    callback: (result) => {
      if (result.success) {

        var user_systems = [];

        result.data.forEach(function(childSnapshot) {
          system_key = childSnapshot.key;
          system_details = childSnapshot.val();

          if (system_details.user_id == user_id) {
            var temp = {
              system_key: system_key,
              data: {
                system_details
              }
            }
            user_systems.push(temp);
          }

        });

        console.log(user_systems);
        result.data = user_systems;

        return res.status(200).json(result);
      } else if (!result.success) {
        return res.status(404).json(result);
      } else {
        return res.status(404).json(result);
      }
    }
  }

  FIREBASE_ADMIN.get(options);
});

/*
 * Update a system
 */
router.post('/update/system', function(req, res, next) {
  const data = JSON.parse(req.body.data);
  if (data.id == undefined) {
    return res.status(404).json({
      success: false,
      message: "Missing an ID"
    });
  } else {
    var options = {
      path: table,
      id: id,
      data: data,
      callback: (result) => {
        if (result.success) {
          return res.status(200).json(result);
        } else if (!result.success) {
          return res.status(404).json(result);
        } else {
          return res.status(404).json(result);
        }
      }
    }

    FIREBASE_ADMIN.add(options);
  }
});
// To delete the mountains of data
router.get('/delete/data', function(req, res, next) {
  const system_id = "-Kolk44VZbY2nwktYnNg/Data";
  var options = {
    path: systems_table,
    id: system_id,
    raw_data: true,
    get_all_children: true,
    callback: (result) => {
      if (result.success) {
        return res.status(200).json(result);
      } else if (!result.success) {
        return res.status(404).json(result);
      } else {
        return res.status(404).json(result);
      }
    }
  }
  FIREBASE_ADMIN.delete(options);

});

// To get a list of the log files
router.get('/logfiles', function(req, res, next) {
  return res.status(200).json(getLogFiles());
});

// To download a log file
router.get('/downloadlogfiles/:file_name', function(req, res) {
  const file_name = req.params.file_name;
  // var file = require('path').dirname(process.argv[1]) + '/winston/' + file_name;
  // var file = '/home/software/nodebackend/winston/' + file_name;
  var file = path.join(SYSTEM_DIR, '/winston/' + file_name);

  LOGGER.info('Downloading from: ' + file);
  res.download(file);
});

// To generate PDF
router.get('/generate/:user_id', function(req, res) {
  const user_id = req.params.user_id;

  generator.generate_timecard_pdf(user_id, '565', '3234', (result) => {
    return res.status(200).json(result);
  });

});

// To download a pdf file
router.get('/downloadtimesheet/:file_name', function(req, res) {
  const file_name = req.params.file_name;
  const file = path.join(SYSTEM_DIR, '/timecards/' + file_name);

  res.download(file);
});

/*
 * Default route
 */
router.all('*', function(req, res, next) {
  return res.status(404).send(INVALID_REQUEST).end();
});

function getLogFiles() {
  fileList = [];
  dir = 'winston';

  var files = fs.readdirSync(dir);
  for (var i in files) {
    if (!files.hasOwnProperty(i)) continue;
    var name = dir + '/' + files[i];
    if (!fs.statSync(name).isDirectory()) {
      fileList.push(name);
    }
  }
  return fileList;
}


module.exports = router;
