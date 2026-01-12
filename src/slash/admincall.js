const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('admincall')
        .setDescription('Issue with user? It will ping us, we will help you out')
        .addStringOption(option =>
            option
                .setName('reason')
                .setDescription('What is the reason?')
                .setRequired(true)),

    async execute(interaction) {
        
        const reasonCall = interaction.options.getString('reason');
        const channel = interaction.channel;

        const adminChannelId = process.env.ADMIN_CHANNEL
        const adminChannel = interaction.client.channels.cache.get(adminChannelId);

        const adminEmbed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setDescription(`Reason ${reasonCall}`)
            .addFields({ name:'Channel', value:`${channel}`,  inline:true })
            .setTimestamp();

        try {
            await interaction.reply({content: `The admins have been called, you only can see this message`, flags: [MessageFlags.Ephemeral] })
            await adminChannel.send({ content: `🚨 New report @here`, embeds: [adminEmbed]});
            
        } catch (err) {
            console.error(err)
            await interaction.reply({content:'An error occured, please DM a mod/admin for now', flags: [MessageFlags.Ephemeral]})
        }

    }
}