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

let isGlobalCooldown = false;

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{ name: 'UNBEATABLE' }],
        status: 'dnd',
        type: 'PLAYING',
    })
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (isGlobalCooldown) return;

    // Pattern search for any words that starts with UN and finished with ABLE
    const pattern = /\bUN[a-zA-Z]*ABLE\b/gi;
    const content = message.content;
    const matches = content.match(pattern);

    // If a word contains prefix un and suffix able, then it sends the message
    if (matches) {
        for (const foundWord of matches) {
            // Handle unable (that is a real word)
            if (foundWord.toLowerCase() === 'unable') continue;

            let isAllCaps = (foundWord === foundWord.toUpperCase());
            let isNoCaps = (foundWord === foundWord.toLowerCase());

            if (!isAllCaps && !isNoCaps) {
                // Error handling
                try {
                    await message.reply(`TN note: it should really only be all caps or no caps`)
                    
                    isGlobalCooldown = true;
                    
                    setTimeout(() => {
                        isGlobalCooldown = false;
                    }, 10000);

                    return;
                } catch (error) {
                    console.error("Couldn't reply or delete message:", error);
                }
            }
        }
    }
});

client.login(TOKEN);