const { EmbedBuilder } = require('discord.js');

// Settings for any fucking chats
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
    },
    MPREG: {
        ID: process.env.MPREG_CHANNEL_ID,
        LIMIT: Number(process.env.MPREG_REACTION_LIMIT),
        EMOJI: process.env.MPREG_EMOJI
    },
    CHAIR: {
        ID: process.env.MPREG_CHANNEL_ID,
        LIMIT: Number(process.env.CHAIR_REACTION_LIMIT),
        EMOJI: process.env.CHAIR_EMOJI
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

    // Tomato Board of the shame (tm)
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

    // Spoiler Pinning 
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

    // MpregChair Pinning, fuck you Wazu
    if ((message.reactions.cache.find(r => r.emoji.name === CONFIG.MPREG.EMOJI)?.count ?? 0) === CONFIG.MPREG.LIMIT && (message.reactions.cache.find(r => r.emoji.name === CONFIG.CHAIR.EMOJI)?.count ?? 0) === CONFIG.CHAIR.LIMIT) {
        
            const mpregchairChannel = botClient.channels.cache.get(CONFIG.MPREG.ID);
            if (!mpregchairChannel) return;

            const embedMpreg = new EmbedBuilder()
                .setColor(0xEDDC24)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(message.content || " [No text content] ")
                .addFields({ name: 'Channel', value: `${message.channel}`, inline: true })
                .setTimestamp()
                .setFooter({ text: `Message ID: ${message.id}` });

            if (message.attachments.size > 0) {
                embedMpreg.setImage(message.attachments.first().proxyURL);
            }

            await mpregchairChannel.send({ content: `🫃🪑 | ${message.url}`, embeds: [embedMpreg] })
        

    }
};