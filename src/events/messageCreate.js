const { triggerResponse, mediaResponse } = require('../utils/responseHelpers.js')

// --- Message Logic ---
module.exports = async (message) => {
    if (message.author.bot) return;

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
};