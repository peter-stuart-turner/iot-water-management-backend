global.MQTT_URL = 'mqtt://m20.cloudmqtt.com';

global.OPTIONS = {
    port: 10775,
    host: 'mqtt://m20.cloudmqtt.com',
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    username: 'rdjghvoh',
    password: 'w7Ex0VTqZViw',
    keepalive: 60,
    reconnectPeriod: 1000,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    clean: true,
    encoding: 'utf8'
};

global.MQTT_CLIENT
