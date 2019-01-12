const HashMap = require('hashmap');

function initializeUserArray() {

  var databaseReference = FIREBASE_ADMIN.getDatabaseReference();

  // Get users from database on startup
  var users_db = databaseReference.child(FIREBASE_USERS_TABLE);

  // Update on item addition
  users_db.on(FIREBASE_CHILD_ADDED, function(snapshot, prevChildKey) {
    const key = snapshot.key;
    const value = snapshot.val();
    var valueMap = new HashMap();

    valueMap.set('email', value.email);
    valueMap.set('first_name', value.first_name);
    valueMap.set('last_name', value.last_name);
    valueMap.set('role', value.role);
    valueMap.set('user_name', value.user_name);

    FIREBASE_USER_ARRAY.set(key, valueMap);
    LOGGER.info("Added user " + key + " to table");
  })

  // Update on item deletion
  users_db.on(FIREBASE_CHILD_REMOVED, function(snapshot, prevChildKey) {
    const key = snapshot.key;
    FIREBASE_USER_ARRAY.remove(key);
    LOGGER.info("Removed system " + key + " from table");
  });

  LOGGER.info("----------------------")
  LOGGER.info("Initialized user array")
  LOGGER.info("----------------------")
}
module.exports = initializeUserArray;

/*
User object interface

email: string,
first_name: string,
last_name: string,
role: string,
systems: array[int],
user_name: string

*/
