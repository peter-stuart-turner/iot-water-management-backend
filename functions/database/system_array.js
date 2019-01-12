const HashMap = require('hashmap');

function initializeSystemArray() {

  var databaseReference = FIREBASE_ADMIN.getDatabaseReference();

  // Get systems from database on startup
  var systems_db = databaseReference.child(FIREBASE_SYSTEMS_TABLE);

  // Update on item addition
  systems_db.on(FIREBASE_CHILD_ADDED, function(snapshot, prevChildKey) {
    const key = snapshot.key;
    const value = snapshot.val();
    var valueMap = new HashMap();

    valueMap.set('GSID', value.GSID);
    valueMap.set('active', value.active);
    valueMap.set('system_model', value.system_model);
    valueMap.set('uid', value.uid);

    FIREBASE_SYSTEM_ARRAY.set(key, valueMap);

    LOGGER.info("Added system " + key + " to table");
  });

  // Update on item deletion
  systems_db.on(FIREBASE_CHILD_REMOVED, function(snapshot, prevChildKey) {
    const key = snapshot.key;
    FIREBASE_SYSTEM_ARRAY.remove(key);
    LOGGER.info("Removed setting " + key + " from table");
  });

  LOGGER.info("Initialized system array")
}
module.exports = initializeSystemArray;

/*
System object interface

GSID: string
active: boolean
system_model: stirng
uid: string

*/
