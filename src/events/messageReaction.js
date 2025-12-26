const { EmbedBuilder } = require('discord.js');

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
}

module.exports = async (reaction) => {
    if (reaction.partial) {
        try { await reaction.fetch(); } catch (err) { return; }
    }
    if (reaction.message.author.bot) return;

    const { emoji, count, message } = reaction;
    // Access client through the message object
    const botClient = message.client; 

    // HANDLE SHAME BOARD (Tomato)
    if (emoji.name === CONFIG.SHAME.EMOJI && count === CONFIG.SHAME.LIMIT) {
        const shameChannel = botClient.channels.cache.get(CONFIG.SHAME.ID);
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
        if (message.channel.id !== CONFIG.SPOILER.ID) return;

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
};