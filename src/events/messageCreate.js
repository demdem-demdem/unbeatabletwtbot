const { triggerResponse, mediaResponse } = require('../utils/responseHelpers.js')
const { updateCounter } = require('../utils/counterHandler');

// --- Message Logic ---
module.exports = async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!say ') && 
        message.author.id === process.env.MY_USER_ID && 
        message.channel.id === process.env.COMMAND_CHANNEL_ID) {

        // Extract the message content after "!say "
        const sayMessage = message.content.slice(5).trim();
        if (!sayMessage) return;

        try {
            // Fetch the channel from the other server
            const targetChannel = await message.client.channels.fetch(process.env.TARGET_CHANNEL_ID);
            
            if (targetChannel) {
                await targetChannel.send(sayMessage);
                // Optional: React to your command to show it worked
                await message.react('✅');
            }
        } catch (err) {
            console.error("Failed to send cross-server message:", err);
            await message.react('❌');
        }
        return; // Stop processing other rules for this message
    }


    const content = message.content;
    const lowerContent = content.toLowerCase();
    
    // 1. User-Specific Logic
    const gothKeywords = ['goth baddie', 'gothie', 'woman in goth'];
    if (message.author.id === '378253524938784769' && gothKeywords.some(key => lowerContent.includes(key))) {
        const newCount = updateCounter(message.author.id);
        return triggerResponse(message, `That's the ${newCount} time you've said goth baddie / gothie.`);
    }

   // 2. Simple Key-Value Triggers
    const simpleTriggers = {
        'quavin it': '# im straight up quavin it!!!!!!!!',
        'quaverin it': '# im straight up quaverin it!!!!!!!!',
        'override beat': '# [H.A.R.M. INTERNAL SECURITY LOG - CELL A-1] \n**SUBJECT**: BEAT \n**RESTRAINT STATUS**: 100% (Acoustic Shield Active) \n**CURRENT STABILIZER FREQUENCY**: 440hz \n-# *NOTE: Any resonance matching 440hz will cause a mechanical lock reset.*',
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

    // 3. Morning Rule
    const morningPattern = /^((g+m+)|(g+o+o+d+\s?m+o+r+n+i+n+g?)|(m+o+r+n+i+n+g?))/i;
    if (morningPattern.test(content)) return triggerResponse(message, "It's afternoon");

    // 4. Mommy Rule
    if (lowerContent.includes('mommy')) {
        return mediaResponse(message, "'Mommy' is such a fun word, isn't it ?", ['./assets/mommy.ogg']);
    }

    // 5. Complex Pattern Matching (UN...ABLE / BATA / TIRED)
    const pattern = /(\bUN[a-zA-Z]*ABLE\b)|(\b(ba[td]a)+\b)|(\bf+u+c+k+i+n+g+\s?t+i+r+e+d?)/gi;
    const matches = content.match(pattern);

    if (matches) {
        for (const word of matches) {
            const lowerWord = word.toLowerCase();
            
            if (lowerWord === 'unable') continue;

            if (/(ba[td]a)+/i.test(word)) {
                return mediaResponse(message, "# SWING", ['./assets/swing.ogg']);
            }

            if (/f+u+c+k+i+n+g+\s?t+i+r+e+d?/i.test(word)) {
                return mediaResponse(message, "I'M SO FUCKING TIRED", ['./assets/tired.ogg']);
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