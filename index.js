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
    if (message.author.bot) return;

    const targetWord = "unbeatable";
    const content = message.content;

    // 'gi' means: g = global (find ALL), i = case-insensitive
    const regex = new RegExp(targetWord, 'gi');
    const matches = content.match(regex);

    // If the word "unbeatable" exists anywhere in the message
    if (matches) {
        let hasError = false;
        let offendingWord = "";

        for (const foundWord of matches) {
            const isAllCaps = (foundWord === "UNBEATABLE");
            const isNoCaps = (foundWord === "unbeatable");

            if (!isAllCaps && !isNoCaps) {
                hasError = true;
                offendingWord = foundWord; 
                break; // Stop looking once we find one mistake
            }
        }

        if (hasError) {
            try {
                await message.reply(`TN note: it should really only be all caps or no caps`);

            } catch (error) {
                console.error("Couldn't reply or delete message:", error);
            }
        }
    }
});

client.login(TOKEN);