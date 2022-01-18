const DESIGN = require('../../resources/design.json');
const { MessageEmbed } = require('discord.js');
const ms = require("ms");

module.exports = {
  config: {
    cooldown: 2
  },
  run: async (interaction, args) => {
    let ping = Date.now()

    interaction.channel.send('Pinging..!').then(async m => {
      await m.delete()
      const pingEmbed = new MessageEmbed()
        .setDescription(`${DESIGN.greendot} **UPTIME:** ${ms(interaction.bot.uptime, { long: true })}\n\n${DESIGN.bluedot} **CLIENT PING:** ${ms(interaction.bot.ws.ping)}\n\n${DESIGN.watch} **MY PING:** ${ms(Date.now() - ping)}`)
        .setColor(DESIGN.green);

      interaction.reply({ embeds: [pingEmbed] });
    })
  },
};