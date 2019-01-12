const firebase = require('firebase');
const admin = require('firebase-admin');

const fb_constant = require('../utils/firebase_constants');

const mqtt_publish = require('../mqtt/mqtt_publish');
const mqtt_subscribe = require('../mqtt/mqtt_subscribe');


function keyValidator() {

    console.log("Inside Key Validator")

}
module.exports = keyValidator;
