const { readdirSync } = require('fs');

module.exports = (bot) => {
    const folders = readdirSync('./events');
    for (const folder of folders) {
        const files = readdirSync(`./events/${folder}`).map(file => file.split('.'));
        for (const [file] of files) {
            const event = require(`../events/${folder}/${file}`);
            bot.on(file, event.bind(null, bot));
        }
    }
};