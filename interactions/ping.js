const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const { colors } = require('../resources/design.json');
const ms = require('ms');

module.exports = {
    command: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('MIS | Shows uptime and current latency'),
    run: async (interaction) => {

        const sent = await interaction.deferReply({ fetchReply: true });
        const _PING_EMBED = new EmbedBuilder()
            .setDescription(`<:online:981315103611813968> **UPTIME:** ${ms(interaction.bot.uptime, { long: true })}\n\n<:client:981315291965448202> **CLIENT PING:** ${ms(interaction.bot.ws.ping)}\n\n<:slowmode:981315291726381126> **MY PING:** ${ms(sent.createdTimestamp - interaction.createdTimestamp)}`)
            .setColor(colors.green);

        await global.cooldown(interaction.user.id, 'ping', 15);
        await interaction.editReply({ embeds: [_PING_EMBED] });

    }
}