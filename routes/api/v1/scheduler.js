const router = require('express').Router();
const firebase = require('firebase');
const admin = require('firebase-admin');

const fb_constant = require('../../../utils/firebase_constants');
const scheduler_constants = require('../../../utils/scheduler_constants');
const firebaseInit = require('../../../firebase/firebase');
const scheduler = require('../../../functions/scheduler/scheduler');

const table = FIREBASE_SYSTEMS_SCHEDULER_TABLE;

const mqtt_publish = require('../../../mqtt/mqtt_publish');

/*
 * Add greywater a greywater scheduler
 */
router.post('/greywater/add', function(req, res, next) {
  const data = JSON.parse(req.body.data);

  var options = {
    system_type: GREYWATER,
    id: data.id,
    data: data.data,
    callback: (result) => {
      if (result.success) {
        return res.status(200).json(result);
      } else if (!result.success) {
        return res.status(404).json(result);
      } else {
        return res.status(404).json(result);
      }
    }
  };

  SCHEDULES.add(options);
});

/*
 * Add a default greywater scheduler
 */
router.post('/greywater/add/default', function(req, res, next) {
  const data = JSON.parse(req.body.data);

  var options = {
    system_type: GREYWATER,
    id: data.id,
  };

  SCHEDULES.add_default(options);
  return res.status(200).send('Update scheduler valid').end();
});


/*
 * Fetch a greywater scheduler
 */
router.get('/greywater/fetch/:system_id', function(req, res, next) {
  const system_id = req.params.system_id;

  var options = {
    id: system_id,
    schedule: GREYWATER,
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
  SCHEDULES.get(options);
});


/*
 * Update a greywater scheduler
 */
router.post('/greywater/update', function(req, res, next) {
  const data = JSON.parse(req.body.data);

  var options = {
    system_type: GREYWATER,
    id: data.id,
    data: data.data,
    callback: (result) => {
      if (result.success) {
        return res.status(200).json(result);
      } else if (!result.success) {
        return res.status(404).json(result);
      } else {
        return res.status(404).json(result);
      }
    }
  };

  SCHEDULES.add(options);
});


/*
 * Delete a greywater scheduler
 */
router.get('/greywater/delete/:system_id', function(req, res, next) {
  const system_id = req.params.system_id;

  var options = {
    system_type: GREYWATER,
    id: system_id,
    callback: (result) => {
      if (result.success) {
        return res.status(200).json(result);
      } else if (!result.success) {
        return res.status(404).json(result);
      } else {
        return res.status(404).json(result);
      }
    }
  };

  SCHEDULES.delete(options);
});

/*
 * Send  MQTT
 */
router.get('/send/mqtt/:system_id/:message', function(req, res, next) {
  const system_id = req.params.system_id;
  const message = req.params.message;

  // const path = system_key + '/GR/C';
  // const message = system_schedule;

  // console.log(system_key + '/GR/C', message);
  console.log(system_id, message);

  mqtt_publish(MQTT_CLIENT, system_id, message);

  return res.status(200).json({
    system_id: system_id,
    message: message
  });
});


/*
 * Default route
 */
router.all('*', function(req, res, next) {
  return res.status(404).send(INVALID_REQUEST).end();
});


module.exports = router;
