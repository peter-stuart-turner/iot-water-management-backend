const HashMap = require('hashmap');

function initializeScheduleArray() {

  var databaseReference = FIREBASE_ADMIN.getDatabaseReference();

  // Get schedules from database on startup
  var schedule_db = databaseReference.child(FIREBASE_SYSTEMS_SCHEDULER_TABLE);

  // Update on item addition
  schedule_db.on(FIREBASE_CHILD_ADDED, function(snapshot, prevChildKey) {
    snapshot.forEach(function(childSnapshot) {
      const key = childSnapshot.key;
      const value = snapshot.val();
      var valueMap = new HashMap();

      childSnapshot.forEach(function(childChildSnapshot) {
        const scheduleType = childChildSnapshot.key;
        const childValues = childChildSnapshot.val();
        var scheduleValues = new HashMap();

        scheduleValues.set('days', childValues.days);
        scheduleValues.set('hour', childValues.hour);
        scheduleValues.set('minutes', childValues.minutes);

        valueMap.set(scheduleType, scheduleValues);
        LOGGER.info("Added schedule type " + scheduleType + " to " + key);
      });

      FIREBASE_SCHEDULE_ARRAY.set(key, valueMap);
      LOGGER.info("Added schedule " + key + " to table");
    });

  });

  // Update on item deletion
  schedule_db.on(FIREBASE_CHILD_REMOVED, function(snapshot, prevChildKey) {
    const key = snapshot.key;
    FIREBASE_SCHEDULE_ARRAY.remove(key);
    LOGGER.info("Removed schedule " + key + " from table");
  });

  LOGGER.info("Initialized schedule array")
}
module.exports = initializeScheduleArray;

/*
Schedule object interface

Either has 'b', 'g' and 'o' as keys or just 'i'.
Each has interface that looks like:

days: Array of ints
hour: int
minutes: int

*/
