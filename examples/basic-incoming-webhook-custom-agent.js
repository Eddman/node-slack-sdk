/**
 * Example for using an Incoming Webhook with custom agent
 */

const { IncomingWebhook } = require('../dist');

// Get a URL by creating an app at <https://api.slack.com/apps?new_app=1>, and configuring an Incoming Webhook
// It's always a good idea to keep sensitive data like the url outside your source code. Prefer environment variables.
const url = process.env.SLACK_WEBHOOK_URL || '';

if (!url) { console.log('You must specify a webhook url to use this example'); process.exitCode = 1; return; }

const proxyUrl = process.env.SLACK_PROXY_URL || '';
const proxyPort = process.env.SLACK_PROXY_PORT || '';
const proxyScheme = process.env.SLACK_PROXY_SCHEME || 'http';
const proxyEndpoint = `${proxyScheme}://${proxyUrl}:${proxyPort}`;

const tunnel = require('tunnel');
const tunnelAgent = tunnel.httpsOverHttp({
  proxy: {
    host: proxyUrl,
    port: proxyPort
  }
});
const webhookTunnelAgent = new IncomingWebhook(url, { agent: tunnelAgent } );

//Send IncomingWebhook Message over tunnel
sendWebhookMessage(webhookTunnelAgent, 'Hello World, over tunnel agent!');

const HttpsProxyAgent = require('https-proxy-agent');
const httpsProxyAgent = new HttpsProxyAgent(proxyEndpoint);
const webhookHttpsProxyAgent = new IncomingWebhook(url, { agent: httpsProxyAgent });

//Send IncomingWebhook Message over Proxy Agent
sendWebhookMessage(webhookHttpsProxyAgent, 'Hello World, over https-proxy-agent!');

/**
 *
 * @param webhookInstance
 * @param message
 */
function sendWebhookMessage(webhookInstance, message) {
  webhookInstance.send({
    text: message
  }, (error, response) => {
    if (error) {
      return console.error(error);
    }
    console.log(response);
  });
}
