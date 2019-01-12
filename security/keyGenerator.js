const firebase = require('firebase');
const admin = require('firebase-admin');

const fb_constant = require('../utils/firebase_constants');
const security_constants = require('../utils/security_constants');
const mqtt_publish = require('../mqtt/mqtt_publish');
const mqtt_subscribe = require('../mqtt/mqtt_subscribe');

const keygen = require("keygenerator");

function keyGenerator() {

    console.log("Inside Key Generator Class")

    this.getNewKey = function(keyLength){
            key = keygen._({
            forceUppercase: true,
            length: keyLength
          });
          return key;
    }

}
module.exports = keyGenerator;
