// Load environment variables from `.env` file (optional)
require('dotenv').config();

// Required Slack libraries
// Slack Events API adapter
const createSlackEventAdapter = require('@slack/events-api').createSlackEventAdapter;
const slackEvents = createSlackEventAdapter(process.env.SLACK_VERIFICATION_TOKEN);
// Slack Web API client
const WebClient = require('@slack/client').WebClient;
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

// *** Greeting any user that says "hi" ***
slackEvents.on('message', (message, body) => {
  // Only deal with messages that have no subtype (plain messages) and contain 'hi'
  if (!message.subtype && message.text.indexOf('hi') >= 0) {
    // Log to the console for visibility
    console.log(`Received a message event: user ${message.user} in channel ${message.channel} says ${message.text}`);
    // Respond to the message back in the same channel
    slackClient.chat.postMessage(message.channel, `Hello <@${message.user}>! :tada:`)
      .catch(console.error);
  }
});

// *** Responding to reactions with the same emoji ***
slackEvents.on('reaction_added', (event, body) => {
  // Log to the console for visibility
  console.log(`Received a reaction event: ${event.reaction} from ${event.user} in channel ${event.item.channel}`);
  // Respond to the reaction back with the same emoji
  slackClient.chat.postMessage(event.item.channel, `:${event.reaction}:`)
    .catch(console.error);
});

// Log any errors we may encounter
slackEvents.on('error', console.error);

// Start a basic HTTP server
slackEvents.start(3000).then(() => {
  console.log(`server listening on port 3000`);
});
