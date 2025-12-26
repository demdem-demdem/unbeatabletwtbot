const { Client, GatewayIntentBits, Partials, ActivityType, EmbedBuilder, chatInputApplicationCommandMention, messageLink } = require('discord.js');
const dotenv = require('dotenv');

dotenv.config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [
        Partials.Message,
        Partials.Reaction,
        Partials.User
    ],
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

// Shame/Tomato Board

const SHAME_CHANNEL_ID = '1453820185407651982';
const REACTION_LIMIT = 10;
const SHAME_EMOJI = '🍅';

client.on('messageReactionAdd', async (reaction, user) => {

    if (reaction.partial) {
        try { await reaction.fetch(); } catch (err) { return; }
    }

    if (reaction.emoji.name !== SHAME_EMOJI) return;
    if (reaction.message.author.bot) return;

    // Set to max reaction limit to not spam the shameboard
    if (reaction.count === REACTION_LIMIT) {
        const shameChannel = client.channels.cache.get(SHAME_CHANNEL_ID);
        if (!shameChannel) return console.log("Shame channel not found");

        const msg = reaction.message;

        // Create the embed
        const shameEmbed = new EmbedBuilder()
            .setColor(0xFF4500)
            .setAuthor({
                name: msg.author.tag,
                iconURL: msg.author.displayAvatarURL({ dynamic: true })
            })
            .setDescription(msg.content || " [No text content] ")
            .addFields(
                { name: 'Channel', value: `${msg.channel}`, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: `Message ID : ${msg.id}` });

        const image = msg.attachments.first();
        if (image) {
            shameEmbed.setImage(image.proxyURL);
        }

        await shameChannel.send({
            content: `🍅 | ${msg.url}`,
            embeds: [shameEmbed]
        });
    }

})

// StarBoard for Spoiler chat

const SPOILER_CHANNEL_ID = '1450980758427537551'
const SPOILER_REACTION_LIMIT = 5;
const SPOILER_EMOJI = '⭐';

client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.partial) {
        try { await reaction.fetch(); } catch (err) { return; }
    }

    if (reaction.emoji.name !== SPOILER_EMOJI) return;
    if (reaction.message.author.bot) return;

    // Set to max reaction limit to not spam the pin board
    if (reaction.count === SPOILER_REACTION_LIMIT) {
        const spoilerChannel = client.channels.cache.get(SPOILER_CHANNEL_ID);
        if (!spoilerChannel) return console.log("Spoiler channel not found");

        const message = reaction.message;

        // Handling pin limit
        try {
            const pins = await reaction.message.channel.messages.fetchPins();

            if (pins.size >= 50) {
                const oldestPin = pins.last();

                if (oldestPin) {
                    await oldestPin.unpin()
                }
            }

            await message.pin();
        } catch (err) {
            console.error("Error managing pins:", err)
        }
    }
})

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