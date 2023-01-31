module.exports = async (bot) => {
    let info = `\u001b[93mINFO\u001b[0m |`;
    console.log(`${info} ${bot.user.username}'s client is online.`);
    await bot.application.fetch();

    //register commands
    //only register commands if they have changed

    await bot.application?.commands?.set(bot.interactions.reduce((arr, { command }) => command ? arr.concat(command[0] ? command : [command]) : arr, []))
        .then(cmds => console.log(`${info} Registered ${cmds.size} slash commands.\n${info} Indexed ${bot.interactions.size} interaction files.`))
        .catch(console.trace);

    //const user = new User('404336524491227149');

    //console.log(user)

    //await user.setCooldown('testing', 30);



    console.log(`\u001b[32mONLINE\u001b[0m | Startup completed.`);
}