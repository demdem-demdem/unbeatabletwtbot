const { Client, GatewayIntentBits, Partials, ActivityType } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const messageCreate = require('./src/events/messageCreate');
const messageReaction = require('./src/events/messageReaction');


// Adds permissions the bot needs
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Reaction, Partials.User],
});

// Initialize the bot
client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{ name: 'UNBEATABLE', type: ActivityType.Playing }],
        status: 'dnd',
    });
});

client.on('messageCreate', (message) => messageCreate(message));
client.on('messageReactionAdd', (reaction) => messageReaction(reaction));

client.login(process.env.TOKEN);