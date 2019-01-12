var mqtt = require('mqtt');

function mqtt_publish(client, topic, message) {

  console.log('About to publish an MQTT message');
  console.log('Client is ' +  client.connected);

  if (client.connected) {
    client.publish(topic, message, function() {
      console.log(message + ' is published on topic ' + topic);
    });
  }

}

module.exports = mqtt_publish;
