const fs = require('fs')

module.exports = {
    name: 'guildCreate',
    execute(guild) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        if(!prefixes[guild.id]) {
            prefixes[guild.id] = {
                prefixes: `${JSON.parse(fs.readFileSync("./config.json", "utf8"))["DefaultPrefix"]}`,
            }
            fs.writeFile("./DataBase/prefixes.json", JSON.stringify(prefixes), (err) => {
                if (err) console.error();
            })
        }

        const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
        // channel.send("Thanks for inviting me")
        let Embed = new MessageEmbed()
        .setTitle(`USER GUIDE`)
        .setColor("GOLD")
        .setDescription(`👋 Hey, I'm **${config["BotInfo"]["name"]}**, a French Multipurpose Bot, and I am going to do my best to help you !!!\nMy default Prefix is \`${prefix}\``)
        .addField(`🔔 You can edit my prefix`, `\`${prefix}settings prefix <new-prefix>\``)
        .addField(`🤖 You can check my commands at`, `\`${prefix}help\``)
        .addField(`🌎 You can change my language by`, `\`${prefix}language <lang>\``)
        .addField(`⚙ You can setup me by`, `\`${prefix}settings help\``)
        .setThumbnail(config["BotInfo"]["IconURL"])
        .setTimestamp()
        channel.send(Embed)
    }
}