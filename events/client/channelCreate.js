const { readFileSync } = require("fs");

module.exports = async (bot, channel) => {

  let x = channel.guild.me.joinedTimestamp;
  if (x + 1000 > new Date()) return;
  let data = readFileSync('resources/cache.json');
  data = JSON.parse(data);
  if (!data.roles) return;
  const index = data.roles.findIndex(data => data.guild == interaction.guild.id);
  if (!index < 0) return;
  data = data.roles[index]

  await channel.permissionOverwrites.create(data.role, {
    SEND_MESSAGES: false,
    ADD_REACTIONS: false
  })

}