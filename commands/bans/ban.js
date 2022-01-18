const DESIGN = require('../../resources/design.json');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  config: {
    cooldown: 10,
    requiredPermissions: ['BAN_MEMBERS']
  },
  run: async (interaction, args) => {
    const banYourself = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription('You can\'t ban yourself.')
      .setColor(DESIGN.red);
    if (interaction.author.id == interaction.target.id) return interaction.reply({ embeds: [banYourself], ephemeral: true });

    const banBot = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription('You can\'t ban me.')
      .setColor(DESIGN.red);
    if (interaction.bot.user.id == interaction.target.id) return interaction.reply({ embeds: [banBot], ephemeral: true });
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
      .setDescription('I can not ban this user.')
      .setColor(DESIGN.invis);
    if (!target.bannable) return interaction.reply({ embeds: [missingPermissions], ephemeral: true })
    let reason;
    if (args[1]) {
      reason = 'The reason stated was ' + args[1].value
    } else {
      reason = 'There was no reason given'
    }

    const certain = new MessageEmbed()
      .setTitle('🤔 Ban Member')
      .setDescription(`Are you sure you want to ban ${interaction.target}?`)
      .setColor(DESIGN.invis);

    let ROW = new MessageActionRow()
      .addComponents([
        new MessageButton()
          .setCustomId(`confirm-${interaction.author.id}-${target.id}-${reason}`)
          .setLabel('Yes')
          .setStyle('SUCCESS'),
        new MessageButton()
          .setCustomId(`deny-${interaction.author.id}-${target.id}-${reason}`)
          .setLabel('No')
          .setStyle('DANGER'),
      ]);

    return interaction.reply({ embeds: [certain], components: [ROW] });
  },
};