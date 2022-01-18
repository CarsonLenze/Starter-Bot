const DESIGN = require('../../resources/design.json');
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    cooldown: 10,
  },
  run: async (button, args) => {
   if (button.author.id !== args[0]) return button.deferUpdate();
   button.message.components[0].components.forEach(obj => {
      obj.disabled = true;
    })

    const operationStopped = new MessageEmbed()
        .setTitle(`${DESIGN.redx} Operation Stopped`)
        .setDescription(`<@${args[1]}> was not banned.`)
        .setColor(DESIGN.red);
    button.reply({ embeds: [operationStopped] });
    button.message.edit({ components: button.message.components });
  }
}