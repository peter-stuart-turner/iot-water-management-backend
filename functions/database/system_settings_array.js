const HashMap = require('hashmap');

function initializeSystemSettingsArray() {

  var databaseReference = FIREBASE_ADMIN.getDatabaseReference();

  // Get system settings from database on startup
  var system_settings_db = databaseReference.child(FIREBASE_SYSTEMS_SETTINGS_TABLE);

  // Update on item addition
  system_settings_db.on(FIREBASE_CHILD_ADDED, function(snapshot, prevChildKey) {
    const key = snapshot.key;
    const value = snapshot.val().settings;
    var valueMap = new HashMap();
    valueMap.set('settings', value);

    FIREBASE_SYSTEM_SETTINGS_ARRAY.set(key, valueMap);
    LOGGER.info("Added system settings " + key + " to table");
  });

  // Update on item deletion
  system_settings_db.on(FIREBASE_CHILD_REMOVED, function(snapshot, prevChildKey) {
    const key = snapshot.key;
    FIREBASE_SYSTEM_SETTINGS_ARRAY.remove(key);
    LOGGER.info("Removed setting " + key + " from table");
  });

  LOGGER.info("Initialized system settings array")
}
module.exports = initializeSystemSettingsArray;
