module.exports = async (bot, guild) => {
  guild.members.cache.get(bot.user.id).setNickname("Darling");
}