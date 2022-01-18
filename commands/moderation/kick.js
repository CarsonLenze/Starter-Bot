const DESIGN = require('../../resources/design.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    cooldown: 10,
    requiredPermissions: ['KICK_MEMBERS']
  },
  run: async (interaction, args) => {
    const kickYourself = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription('You can\'t kick yourself.')
      .setColor(DESIGN.red);
    if (interaction.author.id == interaction.target.id) return interaction.reply({ embeds: [kickYourself], ephemeral: true });

    const kickBot = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription('You can\'t kick me.')
      .setColor(DESIGN.red);
    if (interaction.bot.user.id == interaction.target.id) return interaction.reply({ embeds: [kickBot], ephemeral: true });
    const target = await interaction.guild.members.fetch(interaction.target.id);

    const notFound = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription(`${interaction.target ? interaction.target.username : 'That user'} was not found in this server.`)
      .setColor(DESIGN.red);
    if (!target) return interaction.reply({ embeds: [notFound], ephemeral: true })

    const missingPermissions = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription('I can not kick this user.')
      .setColor(DESIGN.invis);
    if (!target.kickable) return interaction.reply({ embeds: [missingPermissions], ephemeral: true })
    let reason;
    if (args[1]) {
      reason = 'The reason stated was ' + args[1].value
    } else {
      reason = 'There was no reason given'
    }

    const userPunished = new MessageEmbed()
      .setTitle('🤡  You have been kicked')
      .setDescription(reason)
      .setColor(DESIGN.red);
    interaction.target.send({ content: null, embeds: [userPunished] }).catch(err => { });

    const memberPunished = new MessageEmbed()
      .setTitle(`${DESIGN.check} Member kicked.`)
      .setDescription(`${interaction.target} has been kicked`)
      .setColor(DESIGN.green);

    setTimeout(() => {
      target.kick({ reason: reason });
    }, 250);
    interaction.reply({ embeds: [memberPunished] })
  },
};