const { readFileSync } = require("fs");

module.exports = async (bot, member) => {
  let data = readFileSync('resources/cache.json');
  data = JSON.parse(data);
  if (!data.mutes) return;

  let index = data.mutes.findIndex(
    element => element.guild === member.guild.id && element.user === member.user.id
  );
  if (index < 0) return;
  member.roles.add(data.mutes[index].role);
}