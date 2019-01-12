const HashMap = require('hashmap');

function initializeLinkedSystemsArray() {

  var databaseReference = FIREBASE_ADMIN.getDatabaseReference();

  // Get system settings from database on startup
  var system_Linked_Systems_DB = databaseReference.child(FIREBASE_LINKED_SYSTEMS);

  // Update on item addition
  system_Linked_Systems_DB.on(FIREBASE_CHILD_ADDED, function(snapshot, prevChildKey) {
    const key = snapshot.key;
    const value = snapshot.val();
    var valueMap = new HashMap();
    valueMap.set('linkedGSIDs', value);

    FIREBASE_LINKED_SYSTEMS_ARRAY.set(key, valueMap);
    LOGGER.info("Added linked systems " + key + " to table");
  });

  // Update on item deletion
  system_Linked_Systems_DB.on(FIREBASE_CHILD_REMOVED, function(snapshot, prevChildKey) {
    const key = snapshot.key;
    FIREBASE_LINKED_SYSTEMS_ARRAY.remove(key);
    LOGGER.info("Removed setting " + key + " from table");
  });

  LOGGER.info("Initialized Linked Systems Array")
}
module.exports = initializeLinkedSystemsArray;
