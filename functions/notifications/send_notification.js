const ios_notification = require('./ios_notification');
const android_notification = require('./android_notification');

module.exports = {

  sendPushNotification: function (uid){
    console.log('Using UID: ' + uid);
    var iosPayload = {
        user_id: uid,
        type: NOTIFICATION_TYPE_UPDATE
      };

      var androidPayload = {
        data: {
          type: NOTIFICATION_TYPE_UPDATE,
          from_user: uid,
          body: 'A test message from greenchain'
        }
      };

      var peter_uuid = '920fe3bf79d4ae02da18963cb89dfeed0ef68aa2';

      ios_notification.iosSendNotification(peter_uuid, iosPayload);

      LOGGER.info("Sending notification");
  }

}
