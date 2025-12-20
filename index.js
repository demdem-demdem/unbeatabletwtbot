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

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{name: 'UNBEATABLE'}],
        status: 'dnd',
        type: 'PLAYING',
    })
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    const pattern = /\bUN.*?ABLE\b/gi;
    const content = message.content;
    const matches = content.match(pattern);

    
    // If the word "unbeatable" exists anywhere in the message
    if (matches) {
        let hasError = false;
        let offendingWord = "";

        for (const foundWord of matches) {
            const isAllCaps = (foundWord === foundWord.toUpperCase());
            const isNoCaps = (foundWord === foundWord.toUpperCase());

            if (!isAllCaps && !isNoCaps) {
                hasError = true;
                offendingWord = foundWord; 
                break; // Stop looking once we find one mistake
            }
        }
        
            console.log(`Received message: "${message.content}"`);


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