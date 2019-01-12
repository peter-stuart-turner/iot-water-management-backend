const router = require('express').Router();
const firebase = require('firebase');
const admin = require('firebase-admin');

const fb_constant = require('../../../utils/firebase_constants');
const firebaseInit = require('../../../firebase/firebase');

const system = require('../../../functions/systems/system');

const table = FIREBASE_SYSTEMS_TABLE;

/*
 * Get all systems from database
 */
router.get('/fetch/all', function(req, res, next) {
  var options = {
    path: table,
    id: null,
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

  FIREBASE_ADMIN.get(options);
});


/*
 * Add a system to firebase
 */
router.post('/add', function(req, res, next) {
  const data = JSON.parse(req.body.data);
  var id = null;

  if (data.id != undefined) {
    id = data.id;
    data.id = null;
  }

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
});


/*
 * Update a system to firebase
 */
router.post('/update', function(req, res, next) {
  const data = JSON.parse(req.body.data);
  var id = null;

  if (data.id == undefined) {
    return res.status(404).json({
      success: false,
      message: 'No ID provided'
    });
  }
  else{
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


/*
 * Get a system from firebase
 */
router.get('/fetch/:system_id', function(req, res, next) {
  const system_id = req.params.system_id;

  var options = {
    path: table,
    id: system_id,
    get_all_children: false,
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

  FIREBASE_ADMIN.get(options);
});


/*
 * Activate a system
 */
router.post('/activate', function(req, res, next) {
  const data = JSON.parse(req.body.data);
  const hash_id = data.hashed_id;

  system.activate_system(hash_id, (result) => {
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
 * Delete a system to firebase
 */
router.delete('/remove/:system_id', function(req, res, next) {
  const system_id = req.params.system_id;

  var options = {
    path: table,
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
  }

  FIREBASE_ADMIN.delete(options);
});


/*
 * Default route
 */
router.all('*', function(req, res, next) {
  return res.status(404).send(INVALID_REQUEST).end();
});


module.exports = router;
