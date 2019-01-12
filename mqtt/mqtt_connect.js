const mqtt = require('mqtt');
const mqtt_config = require('./mqtt_config');
const mqtt_publish = require('./mqtt_publish');
const mqtt_subscribe = require('./mqtt_subscribe');
const mqtt_message_handler = require('./mqtt_message_handler');

function mqttConnect() {

    LOGGER.info('Trying to connect to MQTT Broker...');

    MQTT_CLIENT = mqtt.connect(MQTT_URL, OPTIONS);

    MQTT_CLIENT.on('error', function(err) {
        LOGGER.error(err);
    });

    MQTT_CLIENT.on('connect', function() {
        LOGGER.info('Connected to MQTT Broker.');
        mqtt_publish(MQTT_CLIENT, "/Backend", "Server Online.");
        subscribeToAllTopics();
    });

}
// Subscribe to MQTT topics
function subscribeToAllTopics(){
    mqtt_subscribe( MQTT_CLIENT, "#", function(topic, message){
      mqtt_message_handler(topic, message);
    });
}

module.exports = mqttConnect;
