const { writeFileSync, readFileSync } = require("fs");
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { role } = require('../../resources/functions.js');
const DESIGN = require('../../resources/design.json');

module.exports = {
  config: {
    cooldown: 10,
    requiredPermissions: ['MANAGE_ROLES', 'MUTE_MEMBERS']
  },
  run: async (interaction, args) => {
    const muteYourself = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription('You can\'t mute yourself.')
      .setColor(DESIGN.red);
    if (interaction.author.id == interaction.target.id) return interaction.reply({ embeds: [muteYourself], ephemeral: true });

    const muteBot = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription('You can\'t mute me.')
      .setColor(DESIGN.red);
    if (interaction.bot.user.id == interaction.target.id) return interaction.reply({ embeds: [muteBot], ephemeral: true });

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
      .setDescription('I can not mute this user.')
      .setColor(DESIGN.invis);
    if (!target.manageable) return interaction.reply({ embeds: [missingPermissions], ephemeral: true })

    const cantMakeMuted = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription('I am missing the ``MANAGE_ROLES`` permission.')
      .setColor(DESIGN.invis);
    let hasPerms = interaction.guild.me.permissions.has("MANAGE_ROLES")
    if (!hasPerms) return interaction.reply({ content: null, embeds: [cantMakeMuted] });

    const alreadyMuted = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription('I cannot manage the muted role.')
      .setColor(DESIGN.invis);
    let roleId = await role(interaction);
    if (target.roles.cache.find(m => m.id === roleId)) return interaction.reply({ content: null, embeds: [alreadyMuted], ephemeral: true });

    let reason;
    if (args[1]) {
      reason = 'The reason stated was ' + args[1]
    } else {
      reason = 'There was no reason given'
    }

    const userPunished = new MessageEmbed()
      .setColor(DESIGN.red)
      .setTitle(`${DESIGN.mute} You have been muted in ${interaction.guild.name}.`)
      .setDescription(reason);
    const memberPunished = new MessageEmbed()
      .setColor(DESIGN.green)
      .setTitle(`${DESIGN.check} Member muted`)
      .setDescription(`${interaction.target} has been muted.`);

    let data = readFileSync('resources/cache.json');
    data = JSON.parse(data);
    if (!data.mutes) data.mutes = []
    if (!data.roles) data.roles = []
    if (!data.bans) data = { bans: [], mutes: data.mutes, roles: data.roles };
    data.mutes.push({ user: interaction.target.id, guild: interaction.guild.id, role: roleId });
    writeFileSync('resources/cache.json', JSON.stringify(data, 0, 4))

    target.roles.add(roleId).then(i => {
      target.user.send({ embeds: [userPunished] }).catch(err => { });
      interaction.reply({ embeds: [memberPunished] });
    })
  },
};