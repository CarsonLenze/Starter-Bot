const DESIGN = require('../../resources/design.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    cooldown: 2
  },
  run: async (interaction, args) => {
    const helpEmbed = new MessageEmbed()
      .setTitle('Commands')
      .addFields(
        { name: `${DESIGN.mute} Mute Commands`, value: '```/mute [user] [?reason] \n/tempmute [user] [time] [?reason] \n/unmute [user]```', inline: false },
        { name: '🤡 Ban Commands', value: '```/ban [user] [?reason] \n/tempban [user] [time] [?reason] \n/unban [user] ```', inline: false },
        { name: `${DESIGN.shield} Moderation Commands`, value: '```/kick [user] \n/purge [amount] \n/info [?user] ```', inline: true },
        { name: `${DESIGN.bluedot} Other Commands`, value: '```/about [?] \n/help [?] \n/ping [?]```', inline: true },
      )
      .setColor(DESIGN.pink);

    interaction.reply({ embeds: [helpEmbed], ephemeral: true })
  },
};