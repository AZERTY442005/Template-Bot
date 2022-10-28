const fs = require('fs')

module.exports = {
    name: 'guildCreate',
    execute(guild) {
        const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
        channel.send("Thanks for inviting me")

        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        if(!prefixes[guild.id]) {
            prefixes[guild.id] = {
                prefixes: `${JSON.parse(fs.readFileSync("./config.json", "utf8"))["DefaultPrefix"]}`,
            }
            fs.writeFile("./DataBase/prefixes.json", JSON.stringify(prefixes), (err) => {
                if (err) console.error();
            })
        }
    }
}