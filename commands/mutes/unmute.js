const { writeFileSync, readFileSync } = require("fs");
const { MessageEmbed } = require('discord.js');
const DESIGN = require('../../resources/design.json');

module.exports = {
  config: {
    cooldown: 10,
    requiredPermissions: ['MANAGE_ROLES', 'MUTE_MEMBERS']
  },
  run: async (interaction, args) => {
    try {
      await interaction.guild.members.fetch(interaction.target.id);
    } catch (err) {
      const notFound = new MessageEmbed()
        .setTitle(`${DESIGN.redx} ERROR`)
        .setDescription(`${interaction.target ? interaction.target.username : 'That user'} was not found in this server.`)
        .setColor(DESIGN.red);
      return interaction.reply({ embeds: [notFound], ephemeral: true })
    }
    const target = await interaction.guild.members.fetch(interaction.target.id);

    const notFound = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription(`${interaction.target ? interaction.target.username : 'That user'} was not found in this server.`)
      .setColor(DESIGN.red);
    if (!target) return interaction.reply({ embeds: [notFound], ephemeral: true })

    const missingPermissions = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription('I can not unmute this user.')
      .setColor(DESIGN.invis);
    if (!target.manageable) return interaction.reply({ embeds: [missingPermissions], ephemeral: true })

    const notPunished = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription(`${interaction.target} is not muted.`)
      .setColor(DESIGN.red);

    let data = readFileSync('resources/cache.json');
    data = JSON.parse(data);
    if (!data.mutes) return interaction.reply({ embeds: [notPunished], ephemeral: true });
    let index = data.mutes.findIndex(
      element => element.guild === interaction.guild.id && element.user === interaction.target.id
    );
    if (!index < 0) return interaction.reply({ embeds: [notPunished], ephemeral: true })

    target.roles.remove(data.mutes[index].role);
    data.mutes.splice(index, 1);

    const unbanned = new MessageEmbed()
      .setTitle(`${DESIGN.check} Member unmuted`)
      .setDescription(`${interaction.target} has been unmuted.`)
      .setColor(DESIGN.green);
    interaction.reply({ embeds: [unbanned] })

    const memberPunished = new MessageEmbed()
      .setColor(DESIGN.green)
      .setTitle(`${DESIGN.check} Unmuted!`)
      .setDescription(`You have been unmuted in ${interaction.guild.name}.`);

    target.user.send({ embeds: [memberPunished] }).catch(err => { /* Literally just here to prevent crashes */ })


  },
};