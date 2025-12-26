const { Client, GatewayIntentBits, Partials, ActivityType, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

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

// Settings for shame and spoiler chats
const CONFIG = {
    SHAME: {
        ID: process.env.SHAME_CHANNEL_ID,
        LIMIT: Number(process.env.SHAME_REACTION_LIMIT),
        EMOJI: process.env.SHAME_EMOJI
    },
    SPOILER: {
        ID: process.env.SPOILER_CHANNEL_ID,
        LIMIT: Number(process.env.SPOILER_REACTION_LIMIT),
        EMOJI: process.env.SPOILER_EMOJI
    }
};

// Initialize cooldowns
let isNormalCooldown = false;
let isMediaCooldown = false;

// Initialize the bot
client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{ name: 'UNBEATABLE', type: ActivityType.Playing }],
        status: 'dnd',
    });
});

// --- Message Logic ---
client.on('messageCreate', async (message) => {
    if (message.author.bot || isNormalCooldown || isMediaCooldown) return;

    const content = message.content;
    const lowerContent = content.toLowerCase();

    // 1. Morning Rule
    const morningPattern = /^((g+m+)|(g+o+o+d+\s?m+o+r+n+i+n+g?)|(m+o+r+n+i+n+g?))/i;
    if (morningPattern.test(content)) return triggerResponse(message, "It's afternoon");

    // 2. Mommy Rule
    if (lowerContent.includes('mommy')) {
        return mediaResponse(message, "'Mommy' is such a fun word, isn't it ?", ['./assets/mommy.ogg']);
    }

    // 3. Regex Patterns (UN...ABLE / BATA)
    const pattern = /(\bUN[a-zA-Z]*ABLE\b)|(\b(ba[td]a)+\b)|(\bf+u+c+k+i+n+g+\s?t+i+r+e+d?)/gi;
    const matches = content.match(pattern);
    if (!matches) return;

    for (const word of matches) {
        if (word.toLowerCase() === 'unable') continue;

        if (/(ba[td]a)+/i.test(word)) {
            return triggerResponse(message, "# SWING");
        }

        if (/(f+u+c+k+i+n+g+\s?t+i+r+e+d?)+/i.test(word)) {
            return mediaResponse(message, "I'M SO FUCKING TIRED", ['./assets/tired.ogg'])
        }

        const isAllCaps = (word === word.toUpperCase());
        const isNoCaps = (word === word.toLowerCase());
        if (!isAllCaps && !isNoCaps) {
            return triggerResponse(message, "TN note: it should really only be all caps or no caps");
        }
    }
});

// --- Combined Reaction Logic ---
client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
        try { await reaction.fetch(); } catch (err) { return; }
    }
    if (reaction.message.author.bot) return;

    const { emoji, count, message } = reaction;

    // HANDLE SHAME BOARD (Tomato)
    if (emoji.name === CONFIG.SHAME.EMOJI && count === CONFIG.SHAME.LIMIT) {
        const shameChannel = client.channels.cache.get(CONFIG.SHAME.ID);
        if (!shameChannel) return;

        const shameEmbed = new EmbedBuilder()
            .setColor(0xFF4500)
            .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
            .setDescription(message.content || " [No text content] ")
            .addFields({ name: 'Channel', value: `${message.channel}`, inline: true })
            .setTimestamp()
            .setFooter({ text: `Message ID: ${message.id}` });

        if (message.attachments.size > 0) {
            shameEmbed.setImage(message.attachments.first().proxyURL);
        }

        await shameChannel.send({ content: `🍅 | ${message.url}`, embeds: [shameEmbed] });
    }

    // HANDLE SPOILER PINNING (Star)
    if (emoji.name === CONFIG.SPOILER.EMOJI && count === CONFIG.SPOILER.LIMIT) {
        // Only run if message is in the specific spoiler channel
        if (message.channel.id !== CONFIG.SPOILER.ID) return;

        // If there are more than 50 pins in the channel (Discord's limit), delete the oldest to replace
        try {
            const pins = await message.channel.messages.fetchPins();
            if (pins.size >= 50) {
                const oldestPin = pins.last();
                if (oldestPin) await oldestPin.unpin();
            }

            await message.pin();


        } catch (err) {
            console.error("Pin Error:", err);
        }
    }
});

// --- Helpers ---
async function triggerResponse(message, text) {
    try {
        isNormalCooldown = true;
        await message.reply(text);
        setTimeout(() => isNormalCooldown = false, 10000);
    } catch (e) { console.error(e); }
}

async function mediaResponse(message, text, media) {
    try {
        isMediaCooldown = true;
        await message.reply({ content: text, files: media });
        setTimeout(() => isMediaCooldown = false, 60000);
    } catch (e) { console.error(e); }
}

client.login(process.env.TOKEN);