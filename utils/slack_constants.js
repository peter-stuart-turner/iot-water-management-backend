const request = require('request');

const slack_server_webhook_api = 'https://hooks.slack.com/services/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';

function Slack() {

  this.post_to_slack_server = (message) => {
    var clientServerOptions = {
                uri: slack_server_webhook_api,
                body: JSON.stringify(payload={
                  "text": message
                }),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
            request(clientServerOptions, function (error, response) {
                console.log(error,response.body);
                return;
            });
  }
}
module.exports = Slack;
