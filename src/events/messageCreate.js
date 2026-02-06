const { triggerResponse, mediaResponse } = require('../utils/responseHelpers.js')
const { updateCounter } = require('../utils/counterHandler');


module.exports = async (message) => {
    if (message.author.bot) return;
    if (message.channel.id === "1450982292167327869" ) return;

    // message logic for me to fuck up with people
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
    };

    // takes the content of all messages and makes it lowercase too because we never know (we always know)
    const content = message.content;
    const lowerContent = content.toLowerCase();
    
    if (message.content.startsWith('!kiss') && message.author.id === process.env.KISSER_USER_ID) {
        await message.reply('*kisses you*');
    };

    // those two fucking twins hates me, so i hate them back. if they say something it will answer (i luv it) (ilove poco btw like the character not the person behind it)
    const thoseTwoTwinsAreTweeking = 'love'
    if (lowerContent.includes(thoseTwoTwinsAreTweeking) && (message.author.id === process.env.POCO_USER_ID || message.author.id === process.env.APOCO_USER_ID)) {
        return triggerResponse(message, `(i luv it)`);
    }

    // Messages for wazu to go to sleep because we cant fucking take it anymore
    if (message.author.id === process.env.SLEEPER_USER_ID) {

        // so we set his timezone (warsaw)
        const wazuTimezone = 'Europe/Warsaw';
        const rightNowRightHere = new Date();

        // we take her timezone and like just make it a single number (like 1 or 23) yknow
        const wazuFuckedUpPolishHour = rightNowRightHere.toLocaleString('en-GB', {
            timeZone: wazuTimezone,
            hour: 'numeric',
            hour12: false,
            weekday: 'long'
        });

        // split the mf array with , because it makes snese > we send the hour and the fucking weekday
        const[wazuDay, wazuHourStringFuckingChrist] = wazuFuckedUpPolishHour.split(', ');
        const wazuFuckUpHourInGeneral = parseInt(wazuHourStringFuckingChrist);
        const isWazuWeekDay = !['Saturday', 'Sunday'].includes(wazuDay);
        

        // if its more than 10pm and less than 8 shE NEEDS TO SLEEP FUCKING CHRIST (also check for that mf weekday) ????
        if (isWazuWeekDay && (wazuFuckUpHourInGeneral >= 22 || wazuFuckUpHourInGeneral < 8)) {
            
            // 1/4 chance for wazu to be yelled at (dumbass)
            const oneOutOfFourForWazuToSleepGoToSleepFfs = Math.floor((Math.random() * 4) + 1);
            
            // initialize the messages like a shit ton so he doenst get killed byt the same message
            const wazuGoTheFuckToSleep = ['GO THE SLEEP', 'WHY ARE YOU STILL AWAKE ???', 'NAH MAN FUCK YOU YOURE STILL AWAKE ??', 'SLEEEEEEEP FFS'];
            
            // THIS CODE IS SELF EXPLENATORY DUMB BITCH ??? CANT YOU FUCKING READ ????
            if (lowerContent.includes('sleep')) {
                const wazuChoice = Math.floor(Math.random() * wazuGoTheFuckToSleep.length);
                return triggerResponse(message, wazuGoTheFuckToSleep[wazuChoice]);
            }
            else if (oneOutOfFourForWazuToSleepGoToSleepFfs === 1) {
                const wazuChoice = Math.floor(Math.random() * wazuGoTheFuckToSleep.length);
                return triggerResponse(message, wazuGoTheFuckToSleep[wazuChoice]);
            }
            
        };
    };
    
   // triggers message for messaged and shit i guess (can be used with regex (don't kill yourself plz))
    const triggers = {
        'quave?r?in it': '# im straight up quavin it!!!!!!!!',
        "you'?re? doing? the" : "same shit",
        'peak': 'divide',
        'jail': 'Prison.',
        'clanker' : 'FUCK YOU !!!'
    };

    // takes the const and make it an array and also make it regex (i hate regex please never use regex)
    for (const [key, response] of Object.entries(triggers)) {
        const regex = new RegExp(`\\b${key}\\b`, 'i');
        if (regex.test(lowerContent)) {
            return triggerResponse(message, response);
        }
    };

    // good morning, its afternoon
    const goodMoriningSunshine = /^((goo+d\s?morning?)|(mo+rning?))/i;
    if (goodMoriningSunshine.test(content)) return triggerResponse(message, "It's afternoon");

    // regex hell (un-able | bata bada | quaver swears yaddayadda)
    const pattern = /(\bUNBEATABLE\b)|(\b(ba[td]a)+\b)|(\bfucking\s?tired?)|(\bhammers?)/gi;
    const matches = content.match(pattern);

    if (matches) {
        for (const word of matches) {
            const lowerWord = word.toLowerCase();
            
            // if it unable we dont check it cauz it woudlve been triggered by the un-able regex and i hate it (help me)
            if (lowerWord === 'unable') continue;

            // swing your shit twin
            if (/(ba[td]a)+/i.test(word)) {
                return mediaResponse(message, "# SWING", ['./assets/swing.ogg']);
            };

            // she was allowed to say it once (she was fucking tired)
            if (/fucking\s?tired?/i.test(word)) {
                return mediaResponse(message, "I'M SO FUCKING TIRED", ['./assets/tired.ogg']);
            };

            //ahah look its funny because its a reference to treble and clef please laugh im so lonely
            if (/hammers?/i.test(word)) {
                var hammers = ["plastic", "drastic"];
                var hammerChoice = Math.floor(Math.random() * hammers.length);
                return triggerResponse(message, hammers[hammerChoice]);
            };

            // maaaw the case is a bit sensitive, so we might as well check it (big baby)
            const isAllCaps = (word === word.toUpperCase());
            const isNoCaps = (word === word.toLowerCase());
            if (!isAllCaps && !isNoCaps) {
                return triggerResponse(message, "TN note: it should really only be all caps or no caps"); // TN note: it should really only be all caps or no caps
            };
        }
    }
};