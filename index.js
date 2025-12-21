JavaScript

const { Client, GatewayIntentBits, ActivityType } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

let isGlobalCooldown = false;

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{ name: 'UNBEATABLE', type: ActivityType.Playing }],
        status: 'dnd',
    });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || isGlobalCooldown) return;

    const content = message.content;

    // COMBINED PATTERNS: We use | (OR) to check both rules at once
    // Group 1 (UN...ABLE) or Group 2 (BATA/BADA)
    const pattern = /(\bUN[a-zA-Z]*ABLE\b)|(\b(ba[td]a)+\b)/gi;
    const matches = content.match(pattern);

    if (!matches) return;

    for (const word of matches) {
        // Handle "unable" exception
        if (word.toLowerCase() === 'unable') continue;

        // Check if it's a "Bata/Bada" word or an "UN...ABLE" word
        const isSwingWord = /(ba[td]a)+/i.test(word);

        if (isSwingWord) {
            await triggerResponse(message, "# SWING");
            return;
        } else {
            // It's an UN...ABLE word: check for mixed casing
            const isAllCaps = (word === word.toUpperCase());
            const isNoCaps = (word === word.toLowerCase());

            if (!isAllCaps && !isNoCaps) {
                await triggerResponse(message, "TN note: it should really only be all caps or no caps");
                return;
            }
        }
    }
});

// Helper function to handle replies and cooldowns to avoid repeating code
async function triggerResponse(message, text) {
    try {
        await message.reply(text);
        isGlobalCooldown = true;
        setTimeout(() => { isGlobalCooldown = false; }, 10000);
    } catch (error) {
        console.error("Error sending reply:", error);
    }
}

client.login(process.env.TOKEN);