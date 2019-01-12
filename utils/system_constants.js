// System mode
global.SYSTEM_MODE = 'dev';

global.SYSTEM_DIR = '';

// Global responses
global.INVALID_REQUEST = 'Invalid request';

// Testing
global.NEW_GREYWATER_SYSTEM = {
    details: {
        model: "GW+"
    },
    settings: {
        scheduling: {
            irrigate: "XXX",
            backwash: "XXX",
            circulateG: "XXX",
            circulateR: "XXX",
        }

    },
    security: {
        key: "",
        valid: true
    },
    data: {
        water: {
            totalSaved: "0",
            history: [0]
        },
        weather: {
            rain: false
        }

    }
}

// MQTT topics
global.TOPIC_ALL              = '#';
global.TOPIC_GR_STATE         = '/GR/SI';
global.TOPIC_GW_LEVELS        = '/GR/GT';
global.TOPIC_RW_LEVELS        = '/GR/RT';
global.TOPIC_GR_COMMAND       = '/GR/C';

// Message Types
global.MESSAGE_SYSTEM_STATE = 'state';
global.MESSAGE_RAIN_WATER_LEVELS = 'rainwater';
global.MESSAGE_GREY_WATER_LEVELS = 'greywater';

// MQTT Grey/Rain commands
global.COMMAND_IRRIGATE       = "i";
global.COMMAND_BACKWASH       = "b";
global.COMMAND_CIRCULATE_GREY = "g";
global.COMMAND_CIRCULATE_RAIN = "r";

// MQTT Grey/Rain topics
global.TOPIC_LEVELS_GREY      = "LVL_G";
global.TOPIC_LEVELS_RAIN      = "LVL_R";
global.TOPIC_GR_STATE         = "GR_STATE";

// System States
// global.SYSTEM_STATES_GR_SI = {
//     "S": "Starting",
//     ".0": "Idle Off",
//     ".1": "Idle On",
//     "f0": "Empty Bio-Tank Off",
//     "f1": "Empty Bio-Tank On",
//     "b0": "Backwash OFf",
//     "b1": "Backwash On",
//     "g0": "Greywater Circulation Off",
//     "g1": "Greywater Circulation On",
//     "r0": "Rainwater Circulation Off",
//     "r1": "Rainwater Circulation On",
//     "d0": "Grey To Drain Off",
//     "d1": "Grey To Drain On",
//     "x0": "Rain To Drain Off",
//     "x1": "Rain To Drain On",
//     "i": "Irrigating On",
//     "s": "Irrigating Off"
// };

global.SYSTEM_STATES_GR_SI = {
    "S": "Starting",
    ".0": "Idle Off",
    ".1": "Idle",
    "f0": "Idle",
    "f1": "Empty Bio-Tank",
    "b0": "Idle",
    "b1": "Backwash",
    "g0": "Idle",
    "g1": "Greywater Circulation",
    "r0": "Idle",
    "r1": "Rainwater Circulation",
    "d0": "Idle",
    "d1": "Grey To Drain",
    "x0": "Idle",
    "x1": "Rain To Drain",
    "i0": "Idle",
    "i1": "Irrigating",
    "y0": "Idle",
    "y1": "Bypass",
    "s": "Idle"
};

// Water Capacities' Related
global.WATER_CAPACITY_FACTORS_ARRAY;
global.FIREBASE_SYSTEM_SETTINGS_ARRAY_LENGTH;
global.FIREBASE_SYSTEM_ARRAY_LENGTH;
