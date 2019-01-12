const router = require('express').Router();
const firebase = require('firebase');
const admin = require('firebase-admin');

const fb_constant = require('../../../utils/firebase_constants');
const firebaseInit = require('../../../firebase/firebase');

const table = FIREBASE_USERS_TABLE;


/*
* Get all users from the database
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
* Get a user from the database
*/
router.get('/fetch/:user_id', function(req, res, next) {
  const user_id = req.params.user_id;

  var options = {
    path: table,
    id: user_id,
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
* Add a user to firebase
*/
router.post('/add', function(req, res, next) {
  const data = JSON.parse(req.body.data);
  var id = null;

  if (data.user_id != undefined) {
    id = data.user_id;
    data.id = null;
  }

  var options = {
    path: table,
    id: id,
    data: data.user_data,
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
* Remove user from the database
*/
router.delete('/remove/:user_id', function(req, res, next) {
  const user_id = req.params.user_id;

  var options = {
    path: table,
    id: user_id,
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

router.all('*', function(req, res, next) {
  return res.status(404).send(INVALID_REQUEST).end();
});

module.exports = router;
