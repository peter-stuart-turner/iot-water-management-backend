const schedule = require('node-schedule');

// Schedule dictionary
global.SCHEDULES;

// Schedule days
global.SCHEDULER_SUNDAY = 0
global.SCHEDULER_MONDAY = 1
global.SCHEDULER_TUESDAY = 2
global.SCHEDULER_WEDNESDAY = 3
global.SCHEDULER_THURSDAY = 4
global.SCHEDULER_FRIDAY = 5
global.SCHEDULER_SATURDAY = 6

// Default greywater schedule values
global.GREYWATER = "gw";

global.GREYWATER_IRRIGATE = "i";
global.GREYWATER_BACKWASH = "b";
global.GREYWATER_CIRCULATE_GREY_WATER = "cg";
global.GREYWATER_CIRCULATE_RAIN_WATER = "cr";

global.GREYWATER_DAY = [new schedule.Range(0, 6)];
global.GREYWATER_HOUR = 17;
global.GREYWATER_MINUTE = 0;
global.GREYWATER_SECOND = 0;

global.GREYWATER_INVALID = 'Invalid schedule type for greywater system';
