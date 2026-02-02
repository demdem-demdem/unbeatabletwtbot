const { Client, GatewayIntentBits, MessageFlags, Partials, ActivityType, Collection, Events } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const dotenv = require('dotenv');
dotenv.config();
const messageCreate = require('./src/events/messageCreate');
const messageReaction = require('./src/events/messageReaction');


// Adds permissions the bot needs cuz its a fat fucking chud mf
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions
    ],
    partials: [Partials.Message, Partials.Reaction, Partials.User],
});

client.commands = new Collection();

const slashPath = path.join(__dirname, 'src/slash');
const slashFiles = fs.readdirSync(slashPath).filter(file => file.endsWith(`.js`));

for (const file of slashFiles) {
    const filePath = path.join(slashPath, file);
    const slash = require(filePath);

    if ('data' in slash && 'execute' in slash) {
        client.commands.set(slash.data.name, slash)
    }
    else {
        console.log(`[WARNING] the fucking command at ${filePath} dont have the data or execute property in it, dumbo`);
    }
}

// Initialize the bot cuz little baby want its milky
client.once('clientReady', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({
        activities: [{ name: 'UNBEATABLE', type: ActivityType.Playing }],
        status: 'dnd',
    });
});

client.on('messageCreate', (message) => messageCreate(message));
client.on('messageReactionAdd', (reaction) => messageReaction(reaction));

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		} else {
			await interaction.reply({
				content: 'There was an error while executing this command!',
				flags: MessageFlags.Ephemeral,
			});
		}
	}
});

module.exports = client;

client.login(process.env.TOKEN);