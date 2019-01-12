const HashMap = require('hashmap');

const userArrayInit = require('./user_array');
const systemArrayInit = require('./system_array');
const scheduleArrayInit = require('./schedule_array');
const tankTypesArrayInit = require('./tank_types_array');
const systemSettingsArrayInit = require('./system_settings_array');
const linkedSystemsArrayInit = require('./linked_systems_array');
const settingsRevampedArrayInit = require('./system_settings_revamped_array');

function initializeArray() {

  /*
  Using hash map from here:
  https://github.com/flesler/hashmap
  */

  FIREBASE_USER_ARRAY = new HashMap();
  FIREBASE_SYSTEM_ARRAY = new HashMap();
  FIREBASE_SCHEDULE_ARRAY = new HashMap();
  FIREBASE_TANK_TYPES_ARRAY = new HashMap();
  FIREBASE_LINKED_SYSTEMS_ARRAY = new HashMap();
  FIREBASE_SYSTEM_SETTINGS_ARRAY = new HashMap();
  FIREBASE_SETTINGS_REVAMPED_ARRAY = new HashMap();

  // Set up water capacity factors
  const initialisedLinkedSystems = new linkedSystemsArrayInit();
  // Setup users
  const initialisedUsers = new userArrayInit();
  // Setup systems
  const initialisedSystems = new systemArrayInit();
  // Setup scheduler
  const initialisedSchedules = new scheduleArrayInit();
  // Setup tank types
  const initialisedTankTypes = new tankTypesArrayInit();
  // Setup system settings
  const initialisedSystemSettings = new systemSettingsArrayInit();

  const initialisedSettingsRevamped = new settingsRevampedArrayInit();

  LOGGER.info("---------------------------")
  LOGGER.info("Initialized Firebase arrays")
  LOGGER.info("---------------------------")

}
module.exports = initializeArray;
