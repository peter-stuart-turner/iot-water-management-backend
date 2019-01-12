const schedule = require('node-schedule');
const fb_constant = require('../../utils/firebase_constants');
const slack_constants = require('../../utils/slack_constants');
const mqtt_publish = require('../../mqtt/mqtt_publish');
const admin = require('firebase-admin');

// Slack integration
const slack = new slack_constants();

/*
 Water Management will be a 'module' through which all server-side
 calculations relating to Greenchain Water Management Systems, namely:
    - Rainwater and Greywater systems
    - GRCombo
    - Irrigation Systems
 */
function GC_WaterManagement() {

  this.handleMQTTPacket = function(GSID, packet) {
    handlePacket(GSID, packet);
  }
}
module.exports = GC_WaterManagement;

/*
Functions
  Note: All callbacks recieve the GSID of the system in question, as well as a data object {}
*/

/*
FUNCTION handlePacket(GSID, packet)
For handling mqtt packets to or from Water Management systems
*/
function handlePacket(GSID, packet) {
  var topic = packet.topic;
  var message = packet.message;
  var splitMessage = message.toString().split('/');

  LOGGER.info('Water Management: Received topic: ' + topic + ' with message: ' + message);

  switch (topic) {
    // Start up, controller expects settings
    case (GSID + '/I'):
      if (message == 'S') {
        LOGGER.info('System starting setup procedure');
        send_Settings_On_Controller_Start_Up(GSID);
      }
      break;
    case (GSID + '/T'):
      const command = SYSTEM_STATES_GR_SI[message];
      if (command) {
        LOGGER.info('System updating state');
        update_Firebase_State_Observable(GSID, command);
      }
      break;
    case (GSID + '/G'):
      //updateSystemObservables(GSID, message[0], MESSAGE_GREY_WATER_LEVELS);
      calc_Lvl_RDS_REVAMPED(GSID, message, MESSAGE_GREY_WATER_LEVELS);
      break;
    case (GSID + '/R'):
      //updateSystemObservables(GSID, message[0], MESSAGE_RAIN_WATER_LEVELS);
      calc_Lvl_RDS_REVAMPED(GSID, message, MESSAGE_RAIN_WATER_LEVELS);
      break;
    case (GSID + '/I'):

      if (splitMessage[0] == 'ER') {
        update_firebase_error_observable(GSID, splitMessage[1])
      }

      break;
    case (GSID + '/UpdateSettings'):
      send_Settings_On_Controller_Start_Up(GSID);
      break;
    case (GSID + '/debug'):
      LOGGER.error('Received debug topic');
      break;
  }
}

function testByteArray() {
  let settingType = 116; // 't'
  let greyTankSetting = 103; // 'g'
  let rainTankSetting = 114; // 'r'
  let greyByteData = 183; // Just 183
  let rainByteData = 200;
  let testByteArray = new Uint8Array(6);
  testByteArray[0] = settingType;
  testByteArray[1] = greyTankSetting;
  testByteArray[2] = greyByteData;
  testByteArray[3] = rainTankSetting;
  testByteArray[4] = rainByteData;
  testByteArray[5] = 0x0000;
  const testBuffer = Buffer.from(testByteArray.buffer);
  let topic = "BYTE ARRAY";
  mqtt_publish(MQTT_CLIENT, topic, testBuffer);
}
/*
FUNCTION send_Settings_On_Controller_Start_Up(GSID)
Sends all necessary settings to a controller upon receiving a start up message
from said controller.
*/
function send_Settings_On_Controller_Start_Up(GSID) {
  var db = admin.database();
  var obs_path = FIREBASE_SYSTEMS_OBSERVABLE_STATE_TABLE + "/" + GSID;

  db.ref(obs_path).update({
    state: SYSTEM_STATES_GR_SI[".1"]
  });

  const info = "Initialized current state in firebase to IDLE (.1). Updated settings of Controller " + GSID + " on start up.";
  LOGGER.info(info)


  get_all_settings(GSID, send_settings_to_controller);
}

/*
FUNCTION calculate_Level_From_RDS(GSID, raw_Distance_To_Surface, water_type)
Calculates the actual water volumes from the Raw Distance to Surface level,
recieved from Ultrasonic Distance Sensors on Tanks
*/
function calculate_Level_From_RDS(GSID, raw_Distance_To_Surface, water_type) {
  raw_Distance_To_Surface = raw_Distance_To_Surface[0];
  var percentage, volume;
  var factors;

  if (FIREBASE_SYSTEM_SETTINGS_ARRAY != undefined && FIREBASE_SYSTEM_SETTINGS_ARRAY.count() >= 0) {
    var tankSettings = FIREBASE_SYSTEM_SETTINGS_ARRAY.get(String(GSID)).get("settings");

    if (WATER_CAPACITY_FACTORS_ARRAY != undefined && WATER_CAPACITY_FACTORS_ARRAY.count() >= 0) {

      if (WATER_CAPACITY_FACTORS_ARRAY.has(tankSettings.gTankType) || WATER_CAPACITY_FACTORS_ARRAY.has(tankSettings.rTankType)) {
        switch (water_type) {
          case MESSAGE_GREY_WATER_LEVELS:
            factors = WATER_CAPACITY_FACTORS_ARRAY.get(tankSettings.gTankType)
            C_over_H = WATER_CAPACITY_FACTORS_ARRAY.get(tankSettings.gTankType).get(WATER_FACTOR_C_OVER_H);
            f100_over_H = WATER_CAPACITY_FACTORS_ARRAY.get(tankSettings.gTankType).get(WATER_FACTOR_100_OVER_H);
            percentage = get_Percentage_Full(factors.get(WATER_FACTOR_100_OVER_H), raw_Distance_To_Surface);
            volume = get_Water_Volume(percentage, tankSettings.gTanks, factors);
            break;
          case MESSAGE_RAIN_WATER_LEVELS:
            factors = WATER_CAPACITY_FACTORS_ARRAY.get(tankSettings.rTankType)
            C_over_H = WATER_CAPACITY_FACTORS_ARRAY.get(tankSettings.rTankType).get(WATER_FACTOR_C_OVER_H);
            f100_over_H = WATER_CAPACITY_FACTORS_ARRAY.get(tankSettings.rTankType).get(WATER_FACTOR_100_OVER_H);
            percentage = get_Percentage_Full(factors.get(WATER_FACTOR_100_OVER_H), raw_Distance_To_Surface);
            volume = get_Water_Volume(percentage, tankSettings.rTanks, factors);
            break;
        }

        if (percentage != undefined && volume != undefined) {
          update_Firebase_Level_Observable(GSID, percentage, volume, water_type);
        }
      }

    }
  }
}
/*
FUNCTION calc_Lvl_RDS_REVAMPED(GSID, raw_Distance_To_Surface, water_type)
Calculates the actual water volumes from the Raw Distance to Surface level,
recieved from Ultrasonic Distance Sensors on Tanks
*/
function calc_Lvl_RDS_REVAMPED(GSID, raw_Distance_To_Surface, water_type) {
  let percentage, volume;
  if (FIREBASE_SETTINGS_REVAMPED_ARRAY != undefined && FIREBASE_SYSTEM_ARRAY != undefined) {
    //raw_Distance_To_Surface = 9
    raw_Distance_To_Surface = raw_Distance_To_Surface[0];
    console.log("RDS IS:", raw_Distance_To_Surface);
    let system = FIREBASE_SYSTEM_ARRAY.get(GSID);
    let isActive = system.get('active');
    let system_model = system.get('system_model');
    let settingsType, settings, tankNumberType;
    console.log("SYSTEM MODEL", system_model)
    if (isActive) {
      switch (system_model) {
        case "Fish Eagle":
        case "GRCombo":
          switch (water_type) {
            case MESSAGE_RAIN_WATER_LEVELS:
              settingsType = "RainFalconSettings";
              tankNumberType = "rTanks";
              break;
            case MESSAGE_GREY_WATER_LEVELS:
              settingsType = "GreyHeronSettings";
              tankNumberType = "gTanks";
              break;
          }
          break;
        case "Rain Falcon":
        case "Rainwater":
          settingsType = "RainFalconSettings";
          tankNumberType = "rTanks";
          break;
        case "Rain Raptor":
          settingsType = "RainRaptorSettings";
          tankNumberType = "rTanks";
          break;
        case "Grey Heron":
        case "Greywater":
          settingsType = "GreyHeronSettings";
          tankNumberType = "gTanks";
          break;
        default:
          LOGGER.info("System is not a water system and so tank levels are not applicable. Weird.");
          return;
      }
      if (settingsType != undefined) {
        settings = FIREBASE_SETTINGS_REVAMPED_ARRAY.get(GSID).get("settings")[settingsType]
        if (settings != undefined) {
          let number_of_tanks = settings[tankNumberType];
          // Where the real legwork happens
          if (settings['defaults_enabled']) {
            // Need to use tank type
            // TODO: Add tank Type functionality
          } else {
            let tankDimensions = settings['tank_dimensions'];
            if (!tankDimensions) {
              LOGGER.info("Could not find tank dimensions, despite defaults being disabled, GSID:", GSID);
            } else {
              let heightFull = tankDimensions['heightFull'];
              let sensorHeight = tankDimensions['sensorHeight'];
              let capacity = tankDimensions['capacity'];
              // console.log("HEIGHT FULL", heightFull);
              // console.log("SENSOR HEIGHT", sensorHeight);
              // console.log("CAPACITY", capacity);
              // console.log("NUMBER OF TANKS", number_of_tanks);
              if ((sensorHeight - raw_Distance_To_Surface) > heightFull) {
                percentage = 100;
              } else {
                percentage = ((sensorHeight - raw_Distance_To_Surface) / (heightFull)) * 100;
                console.log("SENSOR HEIGH", sensorHeight);
                console.log("RAW DISTANCE", raw_Distance_To_Surface)
              }
              volume = number_of_tanks * capacity * (percentage / 100);
              console.log("NUMBER TANKS", number_of_tanks);
              console.log("CAPACITY", capacity)
              console.log("Percentage", percentage)
            }
          }
        } else {
          LOGGER.info("Could not find the correct settings type, looked for type:", settingsType);
        }
      }
    } else {
      LOGGER.info("System is not active and so level was not calculated and updated");
    }
  } else {
    LOGGER.info("Tables are not yet defined and so level was not calculated and updated.");
  }
  if (percentage != undefined && volume != undefined) {
    percentage = Math.abs(parseFloat(percentage).toFixed(2));
    volume = Math.abs(parseFloat(volume).toFixed(2));
    LOGGER.info("Updated system " + GSID + " percentage: " + percentage + ", volume: " + volume);
    update_Firebase_Level_Observable(GSID, percentage, volume, water_type);
  }
}
/*
FUNCTION update_firebase_error_observable(GSID, error)
Updates the tank levels in Firebase, so they can be observable from the Ionic App
*/
function update_firebase_error_observable(GSID, error) {
  var db = admin.database();
  var error_path = FIREBASE_SYSTEMS_OBSERVABLE_STATE_TABLE + "/" + GSID;

  db.ref(error_path).on("value", function(snapshot) {
    var arr = snapshot.val().errors;

    if (!arr) {
      var new_error_array = [];
      new_error_array.push(error);

      db.ref(error_path).update({
        errors: new_error_array
      });
    } else {
      if (!array_contains(error, arr)) {
        arr.push(error);
        db.ref(error_path).update({
          errors: new_error_array
        });
      }
    }

  }, function(errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

}


function array_contains(value, array) {
  for (var ii = 0; ii < array.length; ii++) {
    if (value == array[ii]) {
      return true;
    }
  }
  return false;
}

/*
FUNCTION update_Firebase_Level_Observable( GSID, percentage, volume )
Updates the tank levels in Firebase, so they can be observable from the Ionic App
*/
function update_Firebase_Level_Observable(GSID, percentage, volume, water_type) {
  var db = admin.database();
  var obs_path = FIREBASE_SYSTEMS_OBSERVABLE_STATE_TABLE + "/" + GSID;
  console.log(GSID, percentage, volume, water_type);

  switch (water_type) {
    case MESSAGE_GREY_WATER_LEVELS:
      db.ref(obs_path).update({
        gPercentage: percentage,
        gVolume: volume
      });
      break;
    case MESSAGE_RAIN_WATER_LEVELS:
      db.ref(obs_path).update({
        rPercentage: percentage,
        rVolume: volume
      });
      break;
  }

  const info = "Updated ID: " + GSID + " type: " + water_type + " percentage: " + percentage + " volume: " + volume;
  LOGGER.info(info);
  slack.post_to_slack_server(info);
}

/*
FUNCTION update_Firebase_State_Observable( GSID, new_state )
Updates the water management system state in Firebase,
so they can be observable from the Ionic App.
*/
function update_Firebase_State_Observable(GSID, new_state) {
  var db = admin.database();
  var obs_path = FIREBASE_SYSTEMS_OBSERVABLE_STATE_TABLE + "/" + GSID;
  var log_path = FIREBASE_SYSTEMS_LOG_STATE_TABLE + "/" + GSID;

  var date = new Date(new Date().getTime()).toLocaleString();
  var d = new Date();
  var n = d.getTime();
  var prevState;
  // Get previous state
  db.ref(obs_path).once("value", function(snapshot) {
    let displayableTimeStamp = getDisplayableTimeStamp();
    prevState = snapshot.val();
    console.log("THE PREVIOUS STATE WAS:", prevState.state)
    db.ref(obs_path).update({
      prevState: prevState.state,
      state: new_state,
      dispStamp: displayableTimeStamp
    });
  })
  LOGGER.info("State of system: " + GSID + " was changed to: " + new_state);

  // // Update Log
  // var ref = db.ref(log_path);
  // ref.child("current").update({
  //   state: data,
  //   date: date,
  //   timestamp: n
  // });
  //
  // // Update State History
  // LOGGER.info("Updated current state in firebase to " + data);
  // var history_key = ref.child("history").push().key;
  // ref.child("history").child(history_key).set({
  //   state: data,
  //   date: date,
  //   timestamp: n
  // });
  //
  // LOGGER.info("Added state in firebase to " + data);
}
/*
FUNCTION getDisplayableTimeStamp();
*/
function getDisplayableTimeStamp() {
  let dts;
  let d = new Date();
  var _minutes = d.getMinutes().toString();
  let hours = d.getHours() + 2;
  console.log("_minutes", _minutes)
  console.log("Minutes length", _minutes.length)
  var minutes;
  switch (_minutes.length) {
    case 1:
      console.log("Length is 1")
      minutes = '0' + _minutes;
      break;
    case 2:
      console.log("Length is 2")
      minutes = _minutes;
      break;
  }
  let _day = d.getDay();
  var day;
  switch (_day) {
    case 0:
      day = 'Sunday';
      break;
    case 1:
      day = 'Monday';
      break;
    case 2:
      day = 'Tuesday';
      break;
    case 3:
      day = 'Wednesday';
      break;
    case 4:
      day = 'Thursday';
      break;
    case 5:
      day = 'Friday';
      break;
    case 6:
      day = 'Saturday';
      break;
  }
  dts = "" + hours + ":" + minutes + ", " + day;
  return dts;
}
/*
FUNCTION get_Percentage_Full(f100_over_h, raw_Distance_To_Surface)
Gets the percentage that the tank is full, according to the water
level as well as tank type.
*/
function get_Percentage_Full(f100_over_h, raw_Distance_To_Surface) {
  var percentage_temp = 100 - (f100_over_h * raw_Distance_To_Surface);
  return Math.abs(parseFloat(percentage_temp).toFixed(2));
}

/*
FUNCTION get_Water_Volume(percentage, number_Tanks, factors)
Gets the volume for the system, using the tank type, percentage
and quantity/number of tanks
*/
function get_Water_Volume(percentage, number_Tanks, factors) {
  var fC_over_h = factors.get(WATER_FACTOR_C_OVER_H);
  var h = 100 / factors.get(WATER_FACTOR_100_OVER_H);
  var c = fC_over_h * h;
  var volume = Math.abs(parseFloat(number_Tanks * (percentage / 100) * c).toFixed(2));
  console.log(volume);
  return volume;
}

/*
FUNCTION get_all_settings(GSID, callback) {
Gets all settings for a controller using the controller GSID;
Allows for a callback to be used on the resulting settings,
the callback is not required.
*/
function get_all_settings(GSID, callback) {
  var settings = FIREBASE_SETTINGS_REVAMPED_ARRAY.get(String(GSID)).get("settings");
  if (callback) {
    callback(GSID, settings);
  } else if (!callback) {
    return settings;
  }
}

/*
FUNCTION send_settings_to_controller(GSID, settings) {
Send settings to controller as a settings string
*/
function send_settings_to_controller(GSID, settings) {
  var topic = GSID + "/S";
  var message = "";
  var system_model = FIREBASE_SYSTEM_ARRAY.get(GSID).get('system_model');
  console.log("INSIDE SEND SETTINGS TO CONTROLLER", system_model)
  if (system_model) {
    switch (system_model) {
      case "Bush Shrike":
        var BushShrikeSettings = settings["BushShrikeSettings"];
        console.log("Need to construct bush shrike settings string", BushShrikeSettings)
        create_Shrike_SettingsString(GSID, BushShrikeSettings)
        break;
      case "Fish Eagle":
        var FishEagleSettings = settings;
        create_Eagle_SettingsString(GSID, FishEagleSettings)
        break;
    }
  }
}

function create_Eagle_SettingsString(GSID, FishEagleSettings) {
  let settingsByteArray = new Uint8Array(5);
  var GreyHeronSettings = FishEagleSettings['GreyHeronSettings'];
  var RainFalconSettings = FishEagleSettings['RainFalconSettings'];
  var greyTankHeightByteData = GreyHeronSettings['tank_dimensions']['sensorHeight'];
  var rainTankHeightByteData = RainFalconSettings['tank_dimensions']['sensorHeight'];
  console.log('Grey Tank Sensor Height', greyTankHeightByteData);
  console.log('Rain Tank Sensor Height', rainTankHeightByteData);
  let settingsChar = 83; // 'S'
  let tankSettingChar = 116; // 't'
  let greyTankSettingChar = 103; // 'g'
  let rainTankSettingChar = 114; // 'r'
  settingsByteArray[0] = tankSettingChar;
  settingsByteArray[1] = greyTankSettingChar;
  settingsByteArray[2] = greyTankHeightByteData;
  settingsByteArray[3] = rainTankSettingChar;
  settingsByteArray[4] = rainTankHeightByteData;
  const settingsStringBuffer = Buffer.from(settingsByteArray.buffer);
  console.log("SETTINGS STRING FOR TANKS", settingsByteArray);
  for(let byte in settingsStringBuffer){
    console.log("A byte", byte);
  }
  // Publish to MQTT
  let topic = GSID + "/S";
  mqtt_publish(MQTT_CLIENT, topic, settingsStringBuffer);
}

function create_Shrike_SettingsString(GSID, settings) {
  let settingsByteArrayLength;
  let linkedSystemsBytesLength;
  const settingsChar = 83; // 'S'
  const irrigationSettingChar = 105; // 'i'
  const linkedSystemsSettingChar = 108; // 'l'
  const sourceSettingsChar = 115; // 's'
  let selectedSourceChar;
  let activeZoneIDs = [];
  let activeZoneMinutes = [];
  let zoneSettingsArray = [];
  let linkedGSIDs = [];
  let numberActiveZones, numberLinkedSystems;
  for (let zone of settings.zones) {
    console.log("A zone", zone)
    if (!zone.enabled) {
      continue
    } else {
      let minutes = getMinutes(zone, settings.mode_minutes);
      zoneSettingsArray.push(minutes);
      zoneSettingsArray.push(convertZoneCodeToUint8(zone.id.toLowerCase()));
      activeZoneIDs.push(convertZoneCodeToUint8(zone.id.toLowerCase()));
      activeZoneMinutes.push(minutes);
    }
  }
  switch (settings.sources.source) {
    case "municipal":
      selectedSourceChar = 77; // 'M'
      break;
    default:
      selectedSourceChar = 71; // 'G'
      break;
  }
  var hasLinked = FIREBASE_LINKED_SYSTEMS_ARRAY.has(GSID);
  if (hasLinked) {
    var linkedSystems = FIREBASE_LINKED_SYSTEMS_ARRAY.get(GSID).get("linkedGSIDs");
    linkedSystemsBytesLength = linkedSystems.length + 1;
    console.log("There are linked systems. The linked systems are", linkedSystems);
    console.log("The length of the linked systems part is", linkedSystemsBytesLength);
    linkedSystems.forEach((linkedGSID) => {
      linkedGSIDs.push(linkedGSID + 48);
    })
    let zoneByteArray = new Uint8Array(zoneSettingsArray);
    let sourceByteArray = new Uint8Array(2);
    sourceByteArray[0] = sourceSettingsChar;
    sourceByteArray[1] = selectedSourceChar;
    let linkedByteArray = new Uint8Array(linkedGSIDs.length + 1);
    linkedByteArray[0] = linkedSystemsSettingChar;
    linkedByteArray.set(linkedGSIDs, 1);
    console.log("Zone byte array is", zoneByteArray);
    console.log("Source byte array is", sourceByteArray);
    console.log("Linked byte array is", linkedByteArray);
    // Create the byte array
    settingsByteArrayLength = 2 + zoneByteArray.length + 2 + linkedSystemsBytesLength;
    let settingsByteArray = new Uint8Array(settingsByteArrayLength);
    settingsByteArray[0] = settingsChar;
    settingsByteArray[1] = irrigationSettingChar;
    settingsByteArray.set(zoneByteArray, 2)
    settingsByteArray.set(sourceByteArray, 2 + zoneByteArray.length);
    settingsByteArray.set(linkedByteArray, 2 + zoneByteArray.length + sourceByteArray.length);
    for (let byte of settingsByteArray) {
      console.log("A byte", byte)
    }
    const settingsStringBuffer = Buffer.from(settingsByteArray.buffer);
    // Publish to MQTT
    let topic = GSID + "/S";
    mqtt_publish(MQTT_CLIENT, topic, settingsStringBuffer);
  }
}

function convertZoneCodeToUint8(zoneCode) {
  let zoneCodeUint8;
  switch (zoneCode) {
    case 'a':
      zoneCodeUint8 = 97;
      break;
    case 'b':
      zoneCodeUint8 = 98;
      break;
    case 'c':
      zoneCodeUint8 = 99;
      break;
    case 'd':
      zoneCodeUint8 = 100;
      break;
    case 'e':
      zoneCodeUint8 = 101;
      break;
    case 'f':
      zoneCodeUint8 = 102;
      break;
    case 'g':
      zoneCodeUint8 = 103;
      break;
  }
  return zoneCodeUint8;
}

function getMinutes(zone, modeTimes) {
  if (zone.time_not_mode && (zone.time_minutes != undefined)) {
    return zone.time_minutes
  } else {
    switch (zone.mode) {
      case "E":
        return modeTimes.E;
      case "S":
        return modeTimes.S;
      case "M":
        return modeTimes.M;
    }
  }
}


/*
FUNCTION is_Zone_Excluded(zone, zones_Excluded)
Check whether a specific zone has been marked as 'disabled'
by a client, from the app. Returns a boolean.
*/
function is_Zone_Excluded(zone, zones_Excluded) {
  for (var _zone_ in zones_Excluded) {
    if (zone == zones_Excluded[_zone_]) {
      return true
    }
  }
  return false
}

/*
FUNCTION remove_Empty_Element(array)
The zone modes array starts at index '1', for the first zone.
This means that when retrieving the array, the value at index '0'
is an 'empty element', this function is used to remove it.
*/
function remove_Empty_Element(array) {
  var new_array = array.filter(function(x) {
    return (x !== (undefined || null || ''));
  });
  return new_array;
}

/*
FUNCTION make_Modes_Controller_Friendly(zone_Modes_array)
This changes all upercase letters to lowercase, as well as
changes s/S (for standard) to d, for default
(as the controllers use d and not s, but the app uses s/S)
*/
function make_Modes_Controller_Friendly(zone_Modes_array) {
  for (var z_mode in zone_Modes_array) {
    if (zone_Modes_array[z_mode] == "s" || zone_Modes_array[z_mode] == "S") {
      zone_Modes_array[z_mode] = "d";
    }
    zone_Modes_array[z_mode] = zone_Modes_array[z_mode].toLowerCase();
  }
  return zone_Modes_array;
}
