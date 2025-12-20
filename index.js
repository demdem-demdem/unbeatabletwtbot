const { Client, GatewayIntentBits } = require('discord.js');
const dotenv = require('dotenv');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent 
    ]
});

dotenv.config();
const TOKEN = process.env.TOKEN;

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async (message) => {
    // Ignore other bots and the bot itself
    if (message.author.bot) return;

    const targetWord = "unbeatable";
    const content = message.content;

    // Check if the word is in the message (case-insensitive)
    if (content.toLowerCase().includes(targetWord)) {
        
        // Find all instances of the word
        const regex = new RegExp(targetWord, 'gi');
        const matches = content.match(regex);

        for (const word of matches) {
            const isAllCaps = (word === targetWord.toUpperCase());
            const isNoCaps = (word === targetWord.toLowerCase());

            // If it's mixed-case (like "Unbeatable" or "uNbeatable")
            if (!isAllCaps && !isNoCaps) {
                return message.reply(`TN note: it should really only be all caps or no caps`);
            }
        }
    }
});

client.login(TOKEN);