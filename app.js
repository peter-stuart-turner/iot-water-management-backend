// Copyright 2017, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict';

// Global Variables
const system_constants = require('./utils/system_constants');
const security_constants = require('./utils/security_constants');
const firebase_constants = require('./utils/firebase_constants');
const log_constants = require('./utils/log_constants');
const slack_constants = require('./utils/slack_constants');
const notification_constants = require('./utils/notification_constants');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const path = require('path');

const mqttConnect = require('./mqtt/mqtt_connect');
const mqttSubscribe = require('./mqtt/mqtt_subscribe');
const firebaseInit = require('./firebase/firebase');
const schedulerInit = require('./functions/scheduler/scheduler');
const arrayInit = require('./functions/database/database_array');
const keyVal = require('./security/keyValidation');
const keyGen = require('./security/keyGenerator');
const qrGen = require('./security/QR/QR_Generator');
const waterFunctionsInit = require('./functions/systems/waterManagement');

const weatherInit = require('./functions/weather/weather');
const notitifcationTest = require('./functions/notifications/send_notification');

SYSTEM_DIR = __dirname;

// Routes
const apiV1 = require('./routes/api/v1/route');

// Setup express app
const app = express();

// Setup Firebase admin
const firebaseAdminConnected = new firebaseInit();

// Setup scheduler
const schedulerConnected = new schedulerInit();

// Setup MQTT server
const mqttConnected = mqttConnect();

// Setup Firebase persistance tables
const arrayCreated = arrayInit();

// Setup weather
const weatherInitilized = new weatherInit();

// Test notifications
notitifcationTest.sendPushNotification('dummy');

// Slack integration
const slack = new slack_constants();

// middleware
app.use(bodyParser.urlencoded({ extended: true }));
// CORS middleware
app.use(cors());

// Set static folder
app.use(express.static(path.join(__dirname, 'ng2-admin/dist')));
app.use('/api/v1', apiV1);

// Invalid route
app.get('*', (req, res) =>{
  res.sendFile(path.join(__dirname, 'ng2-admin/dist/index.html'));
});

if (module === require.main) {
    // Start the server
    const server = app.listen(process.env.PORT || 8081, () => {
        const port = server.address().port;

        LOGGER.info(`App listening on port ${port}`);
        slack.post_to_slack_server(`Server started on port ${port}`);
    });
}
