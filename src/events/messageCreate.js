const { triggerResponse, mediaResponse } = require('../utils/responseHelpers.js')
const { updateCounter } = require('../utils/counterHandler');

// message logic for arg
module.exports = async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!say ') && 
        message.author.id === process.env.MY_USER_ID && 
        message.channel.id === process.env.COMMAND_CHANNEL_ID) {

        // Take the content after i say !say or whatever (its litteraly jsut htat)
        const sayMessage = message.content.slice(5).trim();
        if (!sayMessage) return;

        try {
            // Fetch the channel from the other server
            const targetChannel = await message.client.channels.fetch(process.env.TARGET_CHANNEL_ID);
            
            if (targetChannel) {
                await targetChannel.send(sayMessage);
                // React to my message to say it worked
                await message.react('✅');
            }
        } catch (err) {
            console.error("Failed to send cross-server message:", err);
            await message.react('❌');
        }
        return; 
    }


    const content = message.content;
    const lowerContent = content.toLowerCase();
    
    // Count for Hazel cuz she goth badding too much
    const gothKeywords = ['goth baddie', 'gothie', 'woman in goth'];
    if (message.author.id === '378253524938784769' && gothKeywords.some(key => lowerContent.includes(key))) {
        const newCount = updateCounter(message.author.id);
        return triggerResponse(message, `That's the ${newCount} time you've said goth baddie / gothie.`);
    }

   // triggers message for messaged and shit i guess
    const simpleTriggers = {
        'quavin it': '# im straight up quavin it!!!!!!!!',
        'quaverin it': '# im straight up quaverin it!!!!!!!!',
        "you're doing the" : "same shit",
        'peak': 'divide',
        'jail': 'Prison.'
    };

    for (const [key, response] of Object.entries(simpleTriggers)) {
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(lowerContent)) {
            return triggerResponse(message, response);
        }
    }

    // good morning, its afternoon
    const morningPattern = /^((gm)|(good\s?morning?)|(morning?))/i;
    if (morningPattern.test(content)) return triggerResponse(message, "It's afternoon");

    // its such a fun word
    if (lowerContent.includes('mommy')) {
        return mediaResponse(message, "'Mommy' is such a fun word, isn't it ?", ['./assets/mommy.ogg']);
    }

    // regex hell (UN...ABLE / BATA / TIRED)
    const pattern = /(\bUN[a-zA-Z]*ABLE\b)|(\b(ba[td]a)+\b)|(\bfucking\s?tired?)|(\bhammers?)/gi;
    const matches = content.match(pattern);

    if (matches) {
        for (const word of matches) {
            const lowerWord = word.toLowerCase();
            
            if (lowerWord === 'unable') continue;

            if (/(ba[td]a)+/i.test(word)) {
                return mediaResponse(message, "# SWING", ['./assets/swing.ogg']);
            }

            if (/fucking\s?tired?/i.test(word)) {
                return mediaResponse(message, "I'M SO FUCKING TIRED", ['./assets/tired.ogg']);
            }

            if (/hammers?/i.test(word)) {
                var hammers = ["plastic", "drastic"];
                var hammerChoice = Math.floor(Math.random() * hammers.length);
                return triggerResponse(message, hammers[hammerChoice]);
            }

            // Case sensitivity check
            const isAllCaps = (word === word.toUpperCase());
            const isNoCaps = (word === word.toLowerCase());
            if (!isAllCaps && !isNoCaps) {
                return triggerResponse(message, "TN note: it should really only be all caps or no caps");
            }
        }
    }
};