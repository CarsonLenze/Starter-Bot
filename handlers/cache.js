const DESIGN = require('../resources/design.json');
const { MessageEmbed } = require('discord.js');
const { colorify } = require('../resources/functions.js');
const { readFileSync, watchFile, writeFileSync } = require("fs")

module.exports = async (bot) => {
  let banTimer;
  let muteTimer;
  ban();
  mute();

  async function ban() {
    let data = readFileSync('resources/cache.json');
    try {
      JSON.parse(data);
    } catch (err) {
      return writeFileSync('resources/cache.json', JSON.stringify({ bans: [], mutes: [], roles: [] }, 0, 4))
    }
    data = JSON.parse(data);
    let nextBan = data.bans.hasMin('expires')
    if (!nextBan) return;
    let expires = nextBan.expires - Date.now()

    banTimer = setInterval(async function() {
      data.bans.splice(data.bans.indexOf(nextBan), 1);
      writeFileSync('resources/cache.json', JSON.stringify(data, 0, 4))

      try {
        await bot.guilds.fetch(nextBan.guild);
      } catch (error) {
        return console.log('bad guild')
      }
      const guild = await bot.guilds.fetch(nextBan.guild);

      try {
        guild.members.unban(nextBan.user);
      } catch (error) {
        return console.log('could not unban user')
      }

      let user = await bot.users.fetch(nextBan.user);
      const memberPunished = new MessageEmbed()
        .setColor(DESIGN.green)
        .setTitle(`${DESIGN.check} Unbanned!`)
        .setDescription(`You have been unbanned in ${guild.name}.`);

      user.send({ embeds: [memberPunished] }).catch(err => { /* Literally just here to prevent crashes */ })
    }, expires)
  }

  async function mute() {
    let data = readFileSync('resources/cache.json');
    data = JSON.parse(data);
    let nextMute = data.mutes.hasMin('expires')
    if (!nextMute) return;
    let expires = nextMute.expires - Date.now()

    muteTimer = setInterval(async function() {
      data.mutes.splice(data.mutes.indexOf(nextMute), 1);
      writeFileSync('resources/cache.json', JSON.stringify(data, 0, 4))

      try {
        await bot.guilds.fetch(nextMute.guild);
      } catch (error) {
        return console.log('bad guild')
      }
      const guild = await bot.guilds.fetch(nextMute.guild);
      try {
        await guild.members.fetch(nextMute.user)
      } catch (error) {
        return console.log('bad user')
      }
      const member = await guild.members.fetch(nextMute.user);
      try {
        await member.roles.remove(nextMute.role)
      } catch (error) {
        return console.log('bad role')
      }

      const memberPunished = new MessageEmbed()
        .setColor(DESIGN.green)
        .setTitle(`${DESIGN.check} Unmuted!`)
        .setDescription(`You have been unmuted in ${guild.name}.`);

      member.user.send({ embeds: [memberPunished] }).catch(err => { /* Literally just here to prevent crashes */ })
    }, expires)
  }

  watchFile('resources/cache.json', (curr, prev) => {
    clearInterval(banTimer)
    clearInterval(muteTimer)
    let data = readFileSync('resources/cache.json');
    data = JSON.parse(data);
    if (!data.bans.length == 0) ban()
    if (!data.mutes.length == 0) mute()
  });
};

Array.prototype.hasMin = function(attrib) {
  return (this.length && this.reduce(function(prev, curr) {
    return prev[attrib] < curr[attrib] ? prev : curr;
  })) || null;
}

console.log(`${colorify('INFO', 'bright yellow')} | cached all ongoing mutes and bans (cache.js)`)