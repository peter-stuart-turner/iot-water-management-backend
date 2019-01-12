const apn = require('apn');

module.exports = {

  iosSendNotification: function (deviceToken, payload, message) {
    var apnProvider = new apn.Provider({
      token: {
        key: './utils/apns.p8',
        keyId: APPLE_APN_ID,
        teamId: APPLE_TEAM_ID,
      },
      production: true
    });

    // if (n_notifications == undefined) {
    //   n_notifications = 1;
    // }

    var notification = new apn.Notification();
    notification.topic = APPLE_BUNDLE_ID;
    notification.expiry = Math.floor(Date.now() / 1000) + 30;
    notification.badge = 1;
    notification.sound = 'bingbong.aiff';
    notification.alert = message;
    notification.payload = payload

    apnProvider.send(notification, deviceToken).then(function(result) {
      console.log(result);
      console.log(result.failed[0]);
    });
  }

};
