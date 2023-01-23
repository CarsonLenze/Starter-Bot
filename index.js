const { Client, Collection, GatewayIntentBits, InteractionType } = require('discord.js');
//const User = require('./resources/Classes/User.js');
const { readdir } = require('fs');
require('dotenv').config();

const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.DirectMessages] });

readdir(`./handlers`, (error, files) => {
    if (error) {
        console.trace(error);
        return process.exit(1);
    } else files.forEach(file => require(`./handlers/${file}`)(bot));
});

global.InteractionType = InteractionType;
global.bot = bot;
//global.cooldown = async (id, command, seconds) => { await (new User(id)).setCooldown(command, seconds); };

bot.interactions = new Collection();
bot.login(process.env.TOKEN);
