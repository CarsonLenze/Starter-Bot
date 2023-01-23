//const TinyEmbed = require('../../resources/Classes/TinyEmbed.js');
//const { colors, images } = require('../../resources/design.json');
// const User = require('../../resources/Classes/User.js');
// const { EmbedBuilder } = require('discord.js');
// const { parse } = require('path');

module.exports = async (bot, interaction) => {
    interaction.channel = bot.channels.cache.get(interaction.channelId);
    interaction.guild = bot.guilds.cache.get(interaction.guildId);
    interaction.bot = bot;

    if (!interaction.channel) return;

    // for (let option of (interaction.options?.data || []).filter(({ type }) => type == 6)) {
    //     if (option?.user?.bot) return interaction.reply({ embeds: [new TinyEmbed(`Mentioned Bot`, `You cannot use a bot as an option for this.`)], ephemeral: true }).catch(console.trace);
    // }

    let args = []; let file;
    switch (interaction.type) {
        case global.InteractionType.ApplicationCommand:
            file = bot.interactions.get(interaction.commandName.toLowerCase());
            if (interaction.options?.data) args = interaction.options?.data;
            break;
        case global.InteractionType.MessageComponent:
            switch (true) {
                case interaction.isSelectMenu():
                    file = bot.interactions.get(interaction.customId);
                    if (interaction.values[0].split('~')) args = interaction.values[0].split('~');
                    break;
                case interaction.isButton():
                    file = bot.interactions.get(interaction.customId.split('~')[0]);
                    if (interaction.customId.split('~')) args = interaction.customId.split('~').slice(1);
                    break;
            }
            break;
        case global.InteractionType.ModalSubmit:
            file = bot.interactions.get(interaction.customId);
            args = (interaction.fields.fields.map(({ value, customId }) => ({ name: customId, value: value })));
            break;
    }

    if (!file) return console.trace(`There was no file found for ${interaction.customId || interaction.commandName}`);
    //let user = new User(interaction.user.id);


   //do cooldowns later
   //let cooldown = await user.fetchCooldowns(parse(file.path).name);
   //if (cooldown) return interaction.reply({ embeds: [new TinyEmbed(`Cooldown`, `You can use ${interaction.customId ? `this button` : `**/${interaction.commandName}**`} again <t:${Math.round((cooldown.Timestamp + cooldown.Duration) / 1000)}:R>`)], ephemeral: true }).catch(console.trace);

   
    for (let i = 0; i < args.length; i++) if (typeof (args[i]) === 'string') args[i].replace(/\\/gm, '');
    file.run(interaction, args.length > 0 ? args : undefined);
}