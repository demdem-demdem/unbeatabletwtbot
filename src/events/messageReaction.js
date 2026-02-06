const { EmbedBuilder } = require('discord.js');

// so you see its for the boards and the mpreg one for just 24 hours i still hate you wazu btw
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
    // checks the partial, like if its an older message before the bot was turned on well it will check it anyway its awesome really what technology can do to us
    if (reaction.partial) {
        try { await reaction.fetch(); } catch (err) { return; }
    }
    // imagine a fucking loop where the bot just reacts to itself over and over again and never ends. Impossible (it did happen once)
    if (reaction.message.author.bot) return;

    // cuz im tired of using reaction.message and reaction.emoji or smth like that im pretty much lazy i hate you though
    const { emoji, count, message } = reaction;

    // pretty much self explanatory (why am i even commenting anyway)
    const botClient = message.client;

    // Tomato Board of the shame (tm) (its really trademarked, i will sue your asses)
    if (emoji.name === CONFIG.SHAME.EMOJI && count === CONFIG.SHAME.LIMIT) {
        // is the channel configured ? If not just read the fucking readme its in the name)
        const shameChannel = botClient.channels.cache.get(CONFIG.SHAME.ID);
        if (!shameChannel) return; // cuz where the fuck would you put the pinned message anyway ?

        // so you see if the message is already on the board why the fuck would you pin it again ? Are you stupid ? What is your problem ?
        const fetch = await shameChannel.messages.fetch({ limit: 25 });
        const alreadyOnBoard = fetch.some(m => m.embeds[0]?.footer?.text?.endsWith(message.id));
        // i think that's mostly depreciated code like from another version of discord js but who cares at this point thank you random redditor for that

        if (!alreadyOnBoard) {
            const shameEmbed = new EmbedBuilder() //i used an embed builder online : https://embed.dan.onl/ its cool and it works well plz us that cuz its cool
                .setColor(0xFF4500)
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription(message.content || " [No text content] ")
                .addFields({ name: 'Channel', value: `${message.channel}`, inline: true })
                .setTimestamp()
                .setFooter({ text: `Message ID: ${message.id}` });

            // yeah we check if you send anything or else its pointless
            if (message.attachments.size > 0) {
                shameEmbed.setImage(message.attachments.first().proxyURL);
            }

            // then it send its shit
            await shameChannel.send({ content: `🍅 | ${message.url}`, embeds: [shameEmbed] });
        }
    }

    // Spoiler Pinning (because the spoilers wanna be starboarded too but cant cuz server rules yadda yadda i hate it)
    if (emoji.name === CONFIG.SPOILER.EMOJI && count === CONFIG.SPOILER.LIMIT) {
        // if the message channel isnt the spoiler one then it doesnt work at all, basic shit really
        if (message.channel.id !== CONFIG.SPOILER.ID) return;

        try {
            // we fetch the number of pins, if its more than 50 then bye bye to the oldest pinned one, fuck discord btw
            const pins = await message.channel.messages.fetchPins();
            if (pins.size >= 50) {
                const oldestPin = pins.last();
                if (oldestPin) await oldestPin.unpin();
            }

            // pin it. I dare you.
            await message.pin();

        } catch (err) {
            console.error("Pin Error:", err);
        }
    }

    // MpregChair Pinning, fuck you Wazu
    // this fucking logic made me cry blood. cuz we're checking for two differents emoji at the same time we have to do all this shit maybe theres another way but idk so hell)
    if ((message.reactions.cache.find(r => r.emoji.name === CONFIG.MPREG.EMOJI)?.count ?? 0) === CONFIG.MPREG.LIMIT && (message.reactions.cache.find(r => r.emoji.name === CONFIG.CHAIR.EMOJI)?.count ?? 0) === CONFIG.CHAIR.LIMIT) {
        console.log("wassup bbg ily")
        //pretty much the same as the tomatoboard one, just i hate wazu

        const mpregchairChannel = botClient.channels.cache.get(CONFIG.MPREG.ID);
        if (!mpregchairChannel) return;
        
        const fetch = await mpregchairChannel.messages.fetch({ limit: 25 });

        const alreadyOnBoard = fetch.some(m => m.embeds[0]?.footer?.text?.endsWith(message.id));

        if (!alreadyOnBoard) {

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
    }
}; 