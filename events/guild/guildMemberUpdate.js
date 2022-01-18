const { writeFileSync, readFileSync } = require("fs");

module.exports = async (bot, oldMember, newMember) => {
  let data = readFileSync('resources/cache.json');
  data = JSON.parse(data);
  if (!data.roles) return;

  const index = data.roles.findIndex(data => data.guild === oldMember.guild.id);
	console.log(index)
  if (index < 0) return;
  if (oldMember._roles.includes(data.roles[index].role) && !newMember._roles.includes(data.roles[index].role)) {

    let mute = data.mutes.findIndex(
      element => element.guild === oldMember.guild.id && element.user === oldMember.user.id
    );
    if (mute < 0) return;
    data.mutes.splice(mute, 1);
    writeFileSync('resources/cache.json', JSON.stringify(data, 0, 4))
  }
}
