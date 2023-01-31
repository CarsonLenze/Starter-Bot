const { EmbedBuilder } = require('discord.js');
const DESIGN = require('../design.json');

module.exports = class TinyEmbed {
    constructor(title, description, bad = true) {
        let embed = new EmbedBuilder()
            .addFields([{ name: ((bad) ? DESIGN.emojis.x : DESIGN.emojis.check) + ` ${title}`, value: description }])
            .setColor(bad ? DESIGN.colors.red : DESIGN.colors.green)

        return embed;
    }
}