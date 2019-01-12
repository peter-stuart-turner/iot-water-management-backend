var mqtt = require('mqtt');

function mqtt_subscribe(client, subscribe_topic, callback) {

    LOGGER.info('Started MQTT subscribe to ' + subscribe_topic);

    if(client.connected){
      client.subscribe(subscribe_topic, function() {
          client.on('message', function(topic, message, packet) {
              LOGGER.info("Received '" + message + "' on '" + topic + "'");
              return callback(topic, message);
          });
      });
    }
}

module.exports = mqtt_subscribe;
