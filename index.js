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

let isNormalCooldown = false;
let isMediaCooldown = false;

client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{ name: 'UNBEATABLE', type: ActivityType.Playing }],
        status: 'dnd',
    });
});

client.on('messageCreate', async (message) => {
    if (message.author.bot || isNormalCooldown || isMediaCooldown) return;

    const content = message.content;
    const toLowerContent = content.toLowerCase();

    // THE MORNING RULE
    const morningPattern = /^((g+m+)|(g+o+o+d+\s?m+o+r+n+i+n+g?)|(m+o+r+n+i+n+g?))/i;
    if (morningPattern.test(content)) {
        await triggerResponse(message, "It's afternoon");
        return
    }

    if (toLowerContent.includes('mommy')) {
        await mediaResponse(message, "'Mommy' is such a fun word, isn't it ?", ['./assets/mommy.ogg'])
    }

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

        isNormalCooldown = true;
        setTimeout(() => { isNormalCooldown = false; }, 10000);
    } catch (error) {
        console.error("Error sending reply:", error);
    }
}

async function mediaResponse(message, text, media) {
    try {
        await message.reply({
            content: text,
            files: media,
        });

        isMediaCooldown = true;
        setTimeout(() => { isMediaCooldown = false }, 60000);

    } catch (error) {
        console.error("Error sending reply media:", error);
    }
}

client.login(process.env.TOKEN);