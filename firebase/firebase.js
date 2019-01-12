const firebase = require('firebase');
const admin = require('firebase-admin');

const fb_constant = require('../utils/firebase_constants');
const sys_constant = require('../utils/system_constants');

function firebaseInit() {

  var serviceAccount = require("../utils/Greenchain Backend-83f3c6ba2b59.json");

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: FIREBASE_DATABASE_URL
  });

  var db = admin.database();

  // Add new object to database
  this.add = function(parameters) {

    if (typeof parameters.path === 'undefined') {
      return parameters.callback({
        success: false,
        message: INVALID_REQUEST
      });
    }

    var addRef = db.ref().child(parameters.path);

    if (parameters.id === null) {
      parameters.id = addRef.push().key;
    }

    addRef.child(parameters.id).set(parameters.data);

    return parameters.callback({
      success: true,
      object_id: parameters.id,
      message: "Successfully add new system"
    });
  }

  // Get object from database
  this.get = function(parameters) {

    if (typeof parameters.path === 'undefined') {
      return parameters.callback({
        success: false,
        message: INVALID_REQUEST
      });
    }

    var getRef = db.ref().child(parameters.path)

    if (!parameters.get_all_children) {
      if (typeof parameters.id === 'undefined') {
        return parameters.callback({
          success: false,
          message: INVALID_REQUEST
        });
      }

      var getRef = getRef.child(parameters.id);
    }

    return getRef.once('value').then(function(snapshot) {

      var firebase_data = snapshot.val();
      if(parameters.raw_data){
        firebase_data = snapshot;
      }

      return parameters.callback({
        success: true,
        message: "Successfully got system object",
        data: firebase_data
      });
    });

  }

  // Delete object from database
  this.delete = function(parameters) {

    if (typeof parameters.path === 'undefined') {
      return parameters.callback({
        success: false,
        message: INVALID_REQUEST
      });
    }

    if (typeof parameters.id === 'undefined') {
      return parameters.callback({
        success: false,
        message: INVALID_REQUEST
      });
    }

    var getRef = db.ref().child(parameters.path).child(parameters.id);
    getRef.remove();

    return parameters.callback({
      success: true,
      message: "Successfully removed system"
    });
  }

  this.getDatabaseReference = () => {
    return db.ref();
  }

  FIREBASE_ADMIN = this;

  LOGGER.info("--------------------------")
  LOGGER.info("Initialized Firebase Admin")
  LOGGER.info("--------------------------")

}
module.exports = firebaseInit;
