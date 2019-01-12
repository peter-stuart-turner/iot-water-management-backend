const schedule = require('node-schedule');
const slack_constants = require('../../utils/slack_constants');
const mqtt_publish = require('../../mqtt/mqtt_publish');
//const mqtt_subscribe = require('../../mqtt/mqtt_subscribe');

function initializeScheduler() {

  // Slack integration
  const slack = new slack_constants();

  var databaseReference = FIREBASE_ADMIN.getDatabaseReference();

  // Get schedules from database on startup
  var db = databaseReference.child(FIREBASE_SYSTEMS_SCHEDULER_TABLE);
  // Run through all schedules
  function monitorSchedules() {
    // Fired when a child has been detected at startup or when added
    db.on(FIREBASE_CHILD_ADDED, function(snapshot, prevChildKey) {
      processChild(snapshot, FIREBASE_CHILD_ADDED);
    });
  }

  // Process the child and validate data
  function processChild(snapshot, value) {
    var system = snapshot.key;
    var system_schedule = "";
    var system_key = "";

    var schedule_data = "";

    snapshot.forEach(function(childSnapshot) {
      system_key = childSnapshot.key;

      childSnapshot.forEach(function(childChildSnapshot) {
        system_schedule = childChildSnapshot.key;
        schedule_data = childChildSnapshot.val();

        if (system_key != "") {
          if (system_schedule != "") {
            if (schedule_data != "") {
              switch (value) {
                case FIREBASE_CHILD_ADDED:
                  checkSchedule(system, system_schedule, system_key, schedule_data);
                  break;
                default:
                  LOGGER.info('Operation is not supported yet: ' + value);
              }
            }
          }
        }

      });

    });

  }

  // Send message to device via MQTT to start
  function fireSchedule(system, system_schedule, system_key, local_time) {
    var date = new Date(new Date().getTime()).toLocaleString();
    var d = new Date();
    var n = d.getTime();

    const path = system_key + '/C';
    const message = system_schedule;

    if (SYSTEM_MODE == 'production') {
      LOGGER.info('Published messages: ' + path, message);
      mqtt_publish(MQTT_CLIENT, path, message);

      slack.post_to_slack_server(`Schedule fire --> Published mqtt message (${message}) on topic (${path})`);
    }
    else{
      LOGGER.info('Server is in development mode. Schedules are still Fired..');
      LOGGER.info('Fired Schedule:');
      mqtt_publish(MQTT_CLIENT, path, message);
      LOGGER.info('Topic: ' + path);
      LOGGER.info('Command: ' + message);
    }

    // var fire_db = databaseReference.child(FIREBASE_MQTT_TABLE);
    // var fire_db_key = fire_db.push().key;
    // fire_db.child(fire_db_key).set({
    //   system: system,
    //   system_schedule: system_schedule,
    //   system_key: system_key,
    //   message: message,
    //   sent: true,
    //   date: date,
    //   hours_local_time: local_time,
    //   timestamp: n
    // });
  }

  // Divide the minutes into quaters
  function getHourQuater(minutes) {
    if (minutes < 15) {
      return 0;
    } else if (minutes < 30) {
      return 1;
    } else if (minutes < 45) {
      return 2;
    } else if (minutes < 60) {
      return 3;
    } else {
      return -1;
    }
  }

  // Check if the schedule data qualifies for schdeule to be fired
  function checkSchedule(system, system_schedule, system_key, schedule_data) {
    /*
      Days of the week:
      0. Monday
      1. Tuesday
      2. Wednesday
      3. Thursday
      4. Friday
      5. Saturday
      6. Sunday
    */
    const ZAR_TIME_DIFF = 2
    var date = new Date();

    // Get current timezone offset for host device
    var current_time_zone_offset_hours = date.getTimezoneOffset() / 60;
    var utc_Time = date.getHours() + current_time_zone_offset_hours
    var local_time = utc_Time + ZAR_TIME_DIFF;

    // Set the newly adjusted time variables
    var day = date.getDay();
    var hour = local_time;
    var minute = getHourQuater(date.getMinutes());

    if(hour > 24){
      // If the UTC time plus the time zone offset is greater than 24:00 (midnight),
      // Subtract 24 hours from the time and increment the day.
      hour = hour - 24;
      day += 1;
    }
    else if (hour < 0) {
      // If the UTC time plus the time zone offset is less than 00:00 (midnight),
      // Add 24 hours to the time and decrement the day.
      hour = hour + 24;
        day -= 1;
    }

    if(day > 6){
      // If the number of the day is greater than 6 (Sunday), set it to 0 (Monday)
      day = 0
    }
    else if (day < 0) {
      // If the number of the day is less than 0 (Monday), set it to 6 (Sunday)
      day = 6
    }

    var schedule_days = schedule_data.days;
    var schedule_hour = schedule_data.hour;
    var schedule_minute = schedule_data.minutes;

    for (var schedule_day in schedule_days) {
      if (schedule_days[schedule_day] == day) {
        if (schedule_hour == hour) {
          if (schedule_minute == minute) {
            LOGGER.info("===> FIRE SCHEDULE <===")
            fireSchedule(system, system_schedule, system_key, local_time);
          }
        }
      }
    }

  }

  function addData(system, id, data) {
    switch (system) {
      case GREYWATER:
        var grey_water_db = db.child(GREYWATER);
        grey_water_db.child(id).set(data);
        return {
          success: true,
          message: 'Added schedule'
        };
      default:
        return {
          success: false,
          message: 'Not supported yet'
        };
    }
  }

  function deleteData(system, id) {
    switch (system) {
      case GREYWATER:
        db.child(GREYWATER).child(id).remove();
        return {
          success: true,
          message: 'Removed schedule'
        };
      default:
        return {
          success: false,
          message: 'Not supported yet'
        };
    }
  }

  // Add new scheduler
  this.add = function(parameters) {
    var res = addData(parameters.system_type, parameters.id, parameters.data);
    return parameters.callback(res);
  }

  // Add new scheduler with default values
  this.add_default = function(parameters) {

    var tempData = {
      "i": {
        "days": [0, 1, 2, 3, 4, 5, 6],
        "hour": 14,
        "minute": 0
      },
      "b": {
        "days": [0, 1, 2, 3, 4, 5, 6],
        "hour": 15,
        "minute": 0
      },
      "cr": {
        "days": [0, 1, 2, 3, 4, 5, 6],
        "hour": 16,
        "minute": 0
      },
      "cg": {
        "days": [0, 1, 2, 3, 4, 5, 6],
        "hour": 17,
        "minute": 0
      }
    };

    var res = addData(parameters.system_type, parameters.id, tempData);
    return parameters.callback(res);
  }

  // Get scheduler
  this.get = function(parameters) {
    db.child(parameters.schedule).child(parameters.id).once("value", function(snapshot) {
      return parameters.callback({
        success: true,
        message: "Successfully got scheduler object",
        data: snapshot.val()
      });
    });
  }

  // Update scheduler
  this.update = function(parameters) {
    var res = addData(parameters.system_type, parameters.id, parameters.data);
    return parameters.callback(res);
  }

  // Delete scheduler
  this.delete = function(parameters) {
    var res = deleteData(parameters.system_type, parameters.id);
    return parameters.callback(res);
  }

  var rule = new schedule.RecurrenceRule();
  rule.dayOfWeek = new schedule.Range(0, 6, 1);
  rule.minute = new schedule.Range(0, 59, 15);
  // rule.second = new schedule.Range(0, 59, 30);
  // rule.second = new schedule.Range(0, 59, 10);

  schedule.scheduleJob(rule, function() {
    // Perform some task - sending mqtt message
    console.log('\x1b[35m%s\x1b[0m', 'Run every 15 minutes');

    var date = new Date(new Date().getTime()).toLocaleString();

    var scheduler_db = databaseReference.child("log_scheduler_runs");
    var new_schedule_id = scheduler_db.push().key;
    scheduler_db.child(new_schedule_id).set({
      time_date: date
    });

    monitorSchedules();
  });

  LOGGER.info("---------------------")
  LOGGER.info("Initialized Scheduler")
  LOGGER.info("---------------------")

  SCHEDULES = this;

}
module.exports = initializeScheduler;
