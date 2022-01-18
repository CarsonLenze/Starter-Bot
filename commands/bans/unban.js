const DESIGN = require('../../resources/design.json');
const { writeFileSync, readFileSync } = require("fs");
const { MessageEmbed } = require('discord.js');

module.exports = {
  config: {
    cooldown: 10,
    requiredPermissions: ['BAN_MEMBERS']
  },
  run: async (interaction, args) => {
    const banlist = await interaction.guild.bans.fetch();
    const banneduser = banlist.get(interaction.target.id);

    const notPunished = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription(`${interaction.target} is not banned.`)
      .setColor(DESIGN.red);
    if (!banneduser) return interaction.reply({ embeds: [notPunished], ephemeral: true })

    interaction.guild.members.unban(interaction.target.id);
    const unbanned = new MessageEmbed()
      .setTitle(`${DESIGN.check} Member unbanned`)
      .setDescription(`${interaction.target} has been unbanned.`)
      .setColor(DESIGN.green);
    interaction.reply({ embeds: [unbanned] })

    const memberPunished = new MessageEmbed()
      .setColor(DESIGN.green)
      .setTitle(`${DESIGN.check} Unbanned!`)
      .setDescription(`You have been unbanned in ${interaction.guild.name}.`);

    user.send({ embeds: [memberPunished] }).catch(err => { /* Literally just here to prevent crashes */ })

    let data = readFileSync('resources/cache.json');
    data = JSON.parse(data);
    if (!data.bans) return;
    let index = data.bans.findIndex(
      element => element.guild === interaction.guild.id && element.user === interaction.target.id
    );
    if (index < 0) return;
    data.bans.splice(index, 1);
    writeFileSync('resources/cache.json', JSON.stringify(data, 0, 4))
  },
};