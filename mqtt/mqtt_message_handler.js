const mqtt = require('mqtt');
const mqtt_publish = require('./mqtt_publish');
const system = require('../functions/systems/system');
const fb_constant = require('../utils/firebase_constants');
const system_constant = require('../utils/system_constants');
const admin = require('firebase-admin');
const water_functions_file = require('../functions/systems/waterManagement');
const waterManagement = new water_functions_file();

function mqtt_message_handler(topic, message) {
  var mqttPacket = {
    topic: topic,
    message: message
  };
  var GSID = extractGSID(topic);
  switch (topic) {
    case "SERVER/PING":
    case "PING":
      back_at_ya();
      break;
    default:
      if ( is_a_Valid_GSID(GSID) ) {
        initial_Packet_Handler(GSID, mqttPacket);
      }
      break;
  }
}
module.exports = mqtt_message_handler;

/****************************************************************************************************
        FUNCTIONS
*****************************************************************************************************/
/* Function: initial_Packet_Handler(GSID, packet)
Initial handler for MQTT System packets, it determines
the system model and then decides which module
should handle the message and take some action.
*/
function initial_Packet_Handler(GSID, packet) {
  var system_model = getSystemModel(GSID);
  switch (system_model) {
    case "Greywater":
    case "Rainwater":
    case "GRCombo":
    case "Irrigation":
    case "Bush Shrike":
    case "Fish Eagle":
    case "Grey Heron":
      waterManagement.handleMQTTPacket(GSID, packet)
      break;
    default:
      LOGGER.error("Initial MQTT packet handler: Not a valid system model. GSID: " + GSID + " MQTT packet: " + packet);
  }
}

/* Function: extractGSID(topic)
Extracts, if possible, the GSID from a topic string;
if it is determined that the topic string does not
contain a GSID, then the function returns null.
*/
function extractGSID(topic) {
  var GSID = "";
  for (var i = 0; i < String(topic).length; i++) {
    if ((topic[i] == '/') || (topic[i] == "/")) {
      break;
    }
    GSID += topic[i];
  }
  if (GSID.length >= 4) {
    return null;
  }
  return GSID;
}

/* Function: is_a_Valid_GSID(GSID)
Checks for a GSID of null, called after "extractGSID",
which returns null if the GSID is greater than 4 digits.
Temporary Solution.
*/
function is_a_Valid_GSID(GSID) {
  if (GSID == null || GSID == undefined) {
    LOGGER.info('Message received on an invlaid GSID: ' + GSID);
    return false;
  }
  return true;
}

/* Function: getSystemModel(GSID)
Obtains the type of system based on the system's GSID.
*/
function getSystemModel(GSID) {
  var type = "Invalid";
  if(FIREBASE_SYSTEM_ARRAY != undefined){
    if (FIREBASE_SYSTEM_ARRAY.has(GSID)) {
      type = FIREBASE_SYSTEM_ARRAY.get(GSID).get("system_model");
    }
    else{
      LOGGER.info("Invalid system model in initial MQTT handler for GSID " + GSID)
    }
  }

  return type;
}

/* Function: back_at_ya()
Fired upon receiving a server ping, responds
with an acknowledgement of the reception of
the ping.
*/
function back_at_ya() {
  LOGGER.info('Recieved ping and responded');
  var pingTopic = "SERVER/back-at-ya";
  var pingMessage = "Server Online and Connected to Broker";
  mqtt_publish(MQTT_CLIENT, pingTopic, pingMessage);
}
