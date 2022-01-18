const DESIGN = require('../../resources/design.json');
const { MessageEmbed } = require('discord.js');
const { writeFileSync, readFileSync } = require("fs");
const ms = require('ms')

module.exports = {
  config: {
    cooldown: 10,
  },
  run: async (button, args) => {
    if (button.author.id !== args[0]) return button.deferUpdate();
    button.message.components[0].components.forEach(obj => {
      obj.disabled = true;
    })

    let member = await button.guild.members.fetch(args[1])
    const userPunished = new MessageEmbed()
      .setColor(DESIGN.red)
      .setTitle(`🤡 You have been banned${args[3] ? ` for ${ms(ms(args[3]), { long: true })}` : ''} in ${button.guild.name}.`)
      .setDescription(args[2]);
    const memberPunished = new MessageEmbed()
      .setColor(DESIGN.green)
      .setTitle(`${DESIGN.check} Member banned`)
      .setDescription(`<@${args[1]}> has been banned${args[3] ? ` for ${ms(ms(args[3]), { long: true })}` : ''}.`);

    if (args[3]) {
      let data = readFileSync('resources/cache.json');
      data = JSON.parse(data);
      if (!data.mutes) data.mutes = []
      if (!data.roles) data.roles = []
      if (!data.bans) data = { bans: [], mutes: data.mutes, roles: data.roles };
      data.bans.push({ user: args[1], guild: button.guild.id, expires: Date.now() + parseInt(args[3]) });
      writeFileSync('resources/cache.json', JSON.stringify(data, 0, 4))
    }

    setTimeout(() => {
      member.ban({ reason: args[2] });
    }, 250);

    member.user.send({ embeds: [userPunished] }).catch(err => { });
    button.reply({ embeds: [memberPunished] });
    button.message.edit({ components: button.message.components });
  }
}