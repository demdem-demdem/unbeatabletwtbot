let cooldowns = { normal: false, media: false };

// Send message if it doesnt have a media
async function triggerResponse(message, text) {
    if (cooldowns.normal) return;
    try {
        cooldowns.normal = true;
        await message.reply(text);
        setTimeout(() => cooldowns.normal = false, 60000);
    } catch (e) { console.error(e); }
}

// Sends the message that has a media (like mommy.ogg and shit)
async function mediaResponse(message, text, media) {
    if (cooldowns.media) return;
    try {
        cooldowns.media = true;
        await message.reply({ content: text, files: media });
        setTimeout(() => cooldowns.media = false, 600000);
    } catch (e) { console.error(e); }
}

module.exports = { triggerResponse, mediaResponse };