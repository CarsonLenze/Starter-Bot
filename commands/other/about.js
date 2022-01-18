const DESIGN = require('../../resources/design.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    cooldown: 2
  },
  run: async (interaction, args) => {
    const aboutEmbed = new MessageEmbed()
      .setTitle('About Me')
      .setDescription('Darling is a fully functional Moderation bot that is being coded in ([Discord.js](https://discord.js.org/#/) and [Node.js](https://nodejs.org/en/)). The founder and coder of this bot is <@404336524491227149> and with some help from <@433388952292950037> and Carson\'s turtle Tuck, This bot was officially made on <t:1620956368>. Darling is still under development as it will bring new features as time goes by. This bot was originally made for a faction on a Minecraft bedrock server called [ECPE](https://ecpe.network/), and now has been made into a project for multiple servers for everyone to use.')
      .setColor(DESIGN.pink);
      
     await interaction.reply({ embeds: [aboutEmbed], ephemeral: true })
  },
};