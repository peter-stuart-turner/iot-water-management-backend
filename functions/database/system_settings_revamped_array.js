const HashMap = require('hashmap');

function initializeSystemSettingsArrayRevamped() {

  var databaseReference = FIREBASE_ADMIN.getDatabaseReference();

  // Get system settings from database on startup
  var system_settings_db = databaseReference.child(FIREBASE_SETTINGS_REVAMPED_TABLE);

  // Update on item addition
  system_settings_db.on(FIREBASE_CHILD_ADDED, function(snapshot, prevChildKey) {
    const key = snapshot.key;
    const value = snapshot.val();
    var valueMap = new HashMap();
    valueMap.set('settings', value);

    FIREBASE_SETTINGS_REVAMPED_ARRAY.set(key, valueMap);
    LOGGER.info("Added system settings " + key + " to table (REVAMPED)");
  });
  // Update on item Update
  system_settings_db.on('child_changed', function(snapshot, prevChildKey) {
    const key = snapshot.key;
    const value = snapshot.val();
    var valueMap = new HashMap();
    valueMap.set('settings', value);
    console.log("Settings item Changed", value)
    FIREBASE_SETTINGS_REVAMPED_ARRAY.set(key, valueMap);
  });
  // Update on item deletion
  system_settings_db.on(FIREBASE_CHILD_REMOVED, function(snapshot, prevChildKey) {
    const key = snapshot.key;
    FIREBASE_SETTINGS_REVAMPED_ARRAY.remove(key);
    LOGGER.info("Removed setting " + key + " from table");
  });

  LOGGER.info("Initialized system settings array REVAMPED")
}
module.exports = initializeSystemSettingsArrayRevamped;
