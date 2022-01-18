const DESIGN = require('../../resources/design.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    cooldown: 10,
    requiredPermissions: ['MANAGE_MESSAGES']
  },
  run: async (interaction, args) => {
    const lackingPermission = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription(`I do not have enough permissions to purge ${interaction.channel}.`)
      .setColor(DESIGN.red);
    if (!interaction.guild.me.permissionsIn(interaction.channel).has('MANAGE_MESSAGES')) return interaction.reply({ embeds: [lackingPermission] });

    try {
      await interaction.bot.channels.fetch(interaction.channel.id);
    } catch (err) {
      return interaction.reply({ embeds: [lackingPermission] });
    }

    interaction.channel.messages.fetch({ limit: args[0].toString() })
      .then(messages => {
        interaction.channel.bulkDelete(messages, true).then((message) => {
          const channelPurged = new MessageEmbed()
            .setTitle(`${DESIGN.check} Deletion of messages successful`)
            .setDescription(`Total amount of messages purged: ${message.size}`)
            .setColor(DESIGN.green)

          return interaction.reply({ embeds: [channelPurged] });
        })
      })
  },
};