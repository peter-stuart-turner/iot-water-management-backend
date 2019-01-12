const HashMap = require('hashmap');

function initializeTankTypesArray() {

  var databaseReference = FIREBASE_ADMIN.getDatabaseReference();

  // Get tank types from database on startup
  var tanks_db = databaseReference.child(FIREBASE_TANK_TYPES_TABLE);

  // Update on item addition
  tanks_db.on(FIREBASE_VALUE, function(snapshot, prevChildKey) {
    snapshot.forEach(function(childSnapshot) {
      const key = childSnapshot.key;
      const value = childSnapshot.val();
      var valueMap = new HashMap();
      var factorMap = new HashMap();
      valueMap.set('capacity', value.capacity);
      valueMap.set('height_cm', value.height_cm);

      var wFactor_C_over_H = value.capacity / value.height_cm;
      var wFactor_100_over_H = 100 / value.height_cm;
      factorMap.set('wFactor_C_over_H', wFactor_C_over_H);
      factorMap.set('wFactor_100_over_H', wFactor_100_over_H);

      FIREBASE_TANK_TYPES_ARRAY.set(key, valueMap);
      //WATER_CAPACITY_FACTORS_ARRAY.set(key, factorMap);
      LOGGER.info("Added tank type " + key + " to tank types table, also added their factors to water factor table");
    })
  });

  // Update on item deletion
  tanks_db.on(FIREBASE_CHILD_REMOVED, function(snapshot, prevChildKey) {
    const key = snapshot.key;
    FIREBASE_TANK_TYPES_ARRAY.remove(key);
    LOGGER.info("Removed tank type " + key + " from table");
  });

  LOGGER.info("Initialized tank types array")
}
module.exports = initializeTankTypesArray;

/*
Tank type object interface

capacity: int
height_cm: int

*/
