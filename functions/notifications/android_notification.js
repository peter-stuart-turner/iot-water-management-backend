
module.exports = {

  androidSendNotification: function (device_id, payload) {
    var options = {
      priority: "high",
      timeToLive: 30
    };

    FIREBASE_ADMIN.messaging().sendToDevice(device_id, payload, options)
      .then(function(response) {
        console.log("Successfully sent message:", response);
        console.log(response.results[0].messageId);
        return response.results[0].messageId;
      })
      .catch(function(error) {
        console.log("Error sending message:", error);
        return null;
      });
  }

};
