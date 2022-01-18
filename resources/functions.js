const { writeFileSync, readFileSync } = require("fs");
const { Collection } = require('discord.js');
const ms = require('ms')

let cooldownCache = new Collection();
function checkCooldown(command, id, cooldown, isButton) {
  if (!command) return console.trace(`'command' undefined`);
  if (typeof (command) !== 'string') return console.trace(`'command' must be type of String`);
  if (!id) return console.trace(`'id' undefined`);
  if (typeof (id) !== 'string') return console.trace(`'id' must be type of String`);
  if (!cooldown) return console.trace(`'cooldown' undefined`);
  if (typeof (cooldown) !== 'number') return console.trace(`'cooldown' must be type of Number`);
  let name = command + '-c'
  if (isButton) name = command + '-b'

  let userCache = cooldownCache.get(id);
  if (userCache) {
    let ends = userCache.get(name);
    if (ends) {
      if (ends > Date.now()) {
        let string;
        (isButton) ? string = `the \`${command.charAt(0).toUpperCase() + command.slice(1)}\` button` : string = `\`/${command}\``;
        let expires = ends - Date.now()
        if (expires < 1000) expires = 1000
        return { cooldown: true, message: `You can use ${string} again in \`${ms(expires, { long: true })}\`!` };
      } else {
        userCache.delete(name);
        userCache.set(name, Date.now() + (cooldown * 1000));
        return { cooldown: false };
      }
    } else {
      userCache.set(name, Date.now() + (cooldown * 1000));
      return { cooldown: false };
    }
  } else {
    cooldownCache.set(id, new Collection());
    userCache = cooldownCache.get(id);
    userCache.set(name, Date.now() + (cooldown * 1000));
    return { cooldown: false };
  }
}

function colorify(string, color = 'green') {
  switch (color) {
    case 'pass':
      color = 90;
      break;
    case 'red':
      color = 31;
      break;
    case 'bright pass':
      color = 92;
      break;
    case 'bright red':
      color = 91;
      break;
    case 'bright yellow':
      color = 93;
      break;
    case 'aqua':
      color = 36
      break;
    default:
      color = 32;
  }
  return `\u001b[${color}m${string}\u001b[0m`;
}

async function role(interaction) {
  let data = readFileSync('resources/cache.json');
  data = JSON.parse(data);
  if (!data.mutes) data.mutes = [];
  if (!data.roles) data.roles = [];
  if (!data.bans) data = { bans: [], mutes: data.mutes, roles: data.roles };
  const index = data.roles.findIndex(data => data.guild == interaction.guild.id);
  if (!index < 0) return;
  let guildRole = data.roles[index];

  if (!guildRole) {
    let member = await interaction.guild.members.fetch(interaction.bot.user.id);
    let role = await interaction.guild.roles.create({
      name: 'Muted',
      color: "#95a5a6",
      reason: 'There was no muted role',
      position: member.roles.botRole.rawPosition - 2
    });

    interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async (channel) => {
      await channel.permissionOverwrites.create(role, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
      })
    });
    data.roles.push({ guild: interaction.guild.id, role: role.id });
    writeFileSync('resources/cache.json', JSON.stringify(data, 0, 4));
    return role.id;
  }

  let mutedRole = await interaction.guild.roles.fetch(guildRole.role);
  if (!mutedRole || !mutedRole.editable) {
    let member = await interaction.guild.members.fetch(interaction.bot.user.id);
    let role = await interaction.guild.roles.create({
      name: 'Muted',
      color: '#95a5a6',
      reason: 'There was no muted role',
      position: member.roles.botRole.rawPosition - 2
    });

    interaction.guild.channels.cache.filter(c => c.type === 'GUILD_TEXT').forEach(async (channel) => {
      await channel.permissionOverwrites.create(role, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false
      })
    });
    let index = data.roles.findIndex(
      element => element.guild === interaction.guild.id && element.role === guildRole.role
    );
    if (!index < 0) {
      data.roles.splice(index, 1);
    }
    data.roles.push({ guild: interaction.guild.id, role: role.id });
    writeFileSync('resources/cache.json', JSON.stringify(data, 0, 4));
    return role.id;
  }

  return guildRole.role;
}

module.exports = {
  checkCooldown,
  colorify,
  role
};