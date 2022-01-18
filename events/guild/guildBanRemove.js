const { writeFileSync, readFileSync } = require("fs");

module.exports = async (bot, ban) => {
  let data = readFileSync('resources/cache.json');
  data = JSON.parse(data);
  if (!data.bans) return;

  let index = data.bans.findIndex(
    element => element.guild === ban.guild.id && element.user === ban.user.id
  );
  if (index < 0) return;
  data.bans.splice(index, 1);
  writeFileSync('resources/cache.json', JSON.stringify(data, 0, 4))
}