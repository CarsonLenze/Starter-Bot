const { checkCooldown } = require('../../resources/functions.js');
const DESIGN = require('../../resources/design.json');
const { MessageEmbed } = require('discord.js');

module.exports = async (bot, interaction) => {
  if (!interaction.guild) {
    const serverOnly = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription('Commands are to be used in servers only.')
      .setColor(DESIGN.red);

    return interaction.reply({ embeds: [serverOnly], ephemeral: true });
  }

  /* 
  --------------------------------------------------
  Allowed config options: 
  - ?name (String)
  - ?requiredPermissions (Array)
  - ?cooldown (Integer)
  - ?allowBots (Boolean)
  --------------------------------------------------
  */

  interaction.channel = await bot.channels.fetch(interaction.channel.id);
  interaction.guild = await bot.guilds.fetch(interaction.guild.id);
  interaction.bot = bot;
  interaction.author = interaction.member.user;
  interaction.member = await interaction.guild.members.fetch(interaction.author.id);

  let file;
  (!interaction.componentType) ? file = bot.commands.get(interaction.commandName) : file = bot.buttons.get(interaction.customId.split('-')[0]);
  if (!file) return;

  if (file.config.requiredPermissions && !interaction.member.permissions.any(file.config.requiredPermissions)) {
    let permissions = file.config.requiredPermissions
    const missingPermission = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription(`You need ${permissions.length >= 2 ? `\`${permissions[0]}\` or \`${permissions[1]}\`` : `\`${permissions[0]}\``} to use \`/${interaction.commandName}\`.`)
      .setColor(DESIGN.red);

    return interaction.reply({ embeds: [missingPermission], ephemeral: true });
  }

  if (file.config.cooldown && !interaction.author.bot) {
    if (interaction.componentType) interaction.commandName = interaction.customId.split('-')[0];
    let cooldownCheck = checkCooldown(interaction.commandName, interaction.member.id, file.config.cooldown, interaction.customId);
    let embed = new MessageEmbed()
      .setTitle(`${DESIGN.redx} Cooldown`)
      .setDescription(`${cooldownCheck.message}`)
      .setColor(DESIGN.red)

    if (cooldownCheck.cooldown) return interaction.reply({ ephemeral: true, embeds: [embed] });
  }

  let args = [];
  if (interaction.options ?._hoistedOptions) interaction.options._hoistedOptions.forEach(x => { args.push({ type: x.type, value: x.value }) });

  let containsBot = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i].type !== 'USER') {
      args[i] = args[i].value;
    } else {
      let user = await bot.users.fetch(args[i].value);
      if (user.bot) containsBot = true;
      args[i] = user;
      interaction.target = user;
    }
  }

  if (args.length < 1) args = undefined;
  if (interaction.componentType) {
    args = interaction.customId.split('-');
    args.shift();
  }

  let botEmbed = new MessageEmbed()
    .setTitle(`${DESIGN.redx} ERROR`)
    .setDescription(`\`/${interaction.commandName}\` does not allow bots to be mentioned.`)
    .setColor(DESIGN.red)

  if (!file.config.allowBots && containsBot) return interaction.reply({ ephemeral: true, embeds: [botEmbed] });

  try {
    file.run(interaction, args);
  } catch (error) {
    console.trace(error);
    const errorEmbed = new MessageEmbed()
      .setTitle(`${DESIGN.redx} ERROR`)
      .setDescription('I ran into a problem while executing this command!')
      .setColor(DESIGN.red);

    await interaction.reply({ embeds: [errorEmbed], ephemeral: true });
  }
}