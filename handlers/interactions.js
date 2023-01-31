const { parse, resolve } = require('path');
const { readdirSync } = require('fs');

module.exports = (bot) => {
    const Interactionfiles = getFiles('./interactions');
    for (const file of Interactionfiles) {
        const exported = require(resolve(file));

        exported.path = file;
        exported.name = exported?.command?.name ? exported.command.name : parse(file).name;

        bot.interactions.set(exported.name, exported);
    }
};

function getFiles(dir) {
    return readdirSync(dir, { withFileTypes: true })
        .map(file => file.isDirectory() ? getFiles(`${dir}/${file.name}`) : `${dir}/${file.name}`).flat();
};