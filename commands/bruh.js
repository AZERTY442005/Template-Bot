const { MessageEmbed } = require("discord.js");
const fs = require('fs')

module.exports = {
    name: 'bruh',
    description: {"fr": "Envoie un GIF aléatoire de bruh", "en": "Send a random GIF of bruh"},
    aliases: [],
    usage: "bruh",
    category: "Fun",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            const bruhlist = [
                "https://tenor.com/view/bruh-bye-ciao-gif-5156041",
                "https://tenor.com/view/off-work-traffic-bruh-gif-14207439",
                "https://tenor.com/view/bruh-bye-ciao-gif-5156041",
                "https://cdn.discordapp.com/attachments/782886209059029015/783076615571636274/bruh.png",
                "https://tenor.com/view/bruh-phone-drop-micdrop-ded-dead-gif-4568216",
                "https://tenor.com/view/kevin-hart-stare-blink-really-you-serious-gif-7356251",
                "https://tenor.com/view/spit-take-laugh-lmao-gif-9271200",
                "https://tenor.com/view/bruh-bye-ciao-gif-5156041",
                "https://tenor.com/view/off-work-traffic-bruh-gif-14207439",
                "https://tenor.com/view/bruh-bye-ciao-gif-5156041",
                "https://cdn.discordapp.com/attachments/782886209059029015/783076615571636274/bruh.png",
                "https://tenor.com/view/bruh-phone-drop-micdrop-ded-dead-gif-4568216",
                "https://tenor.com/view/kevin-hart-stare-blink-really-you-serious-gif-7356251",
                "https://tenor.com/view/spit-take-laugh-lmao-gif-9271200",
            ]
            const bruhindex = Math.floor(Math.random() * (bruhlist.length - 1)); 
            message.lineReplyNoMention(bruhlist[bruhindex])
            let Embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("RANDOM")
            .setImage(bruhlist[bruhindex])
            .setTimestamp()
            // message.channel.send(Embed)
        } catch (error) { // ERROR PREVENTER
            console.error(`${error}`)
            Embed = new MessageEmbed()
            .setTitle(`${message_language[languages[message.guild.id]]["ErrorPreventer"]}`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("RED")
            message.lineReplyNoMention(Embed)
            var URL = fs.readFileSync("./DataBase/webhook-logs-url.txt", "utf8")
            fetch(URL, {
                "method":"POST",
                "headers": {"Content-Type": "application/json"},
                "body": JSON.stringify(
                    {
                        "username": `${config["BotInfo"]["name"]} Logs`,
                        "avatar_url": `${config["BotInfo"]["IconURL"]}`,
                        "embeds": [
                        {
                            "title": "__Error__",
                            "color": 15208739,
                            "timestamp": new Date(),
                            "author": {
                                "name": `${message.author.username}`,
                                "icon_url": `${message.author.displayAvatarURL()}`,
                            },
                            "fields": [
                                {
                                "name": `User`,
                                "value": `${message.author}`,
                                "inline": false
                                },
                                {
                                    "name": "Server",
                                    "value": `${message.guild.name}`,
                                    "inline": false
                                },
                                {
                                "name": `Command`,
                                "value": `${message.content}`,
                                "inline": false
                                },
                                {
                                "name": `Error`,
                                "value": `${error}`,
                                "inline": false
                                }
                            ],
                        }
                        ]
                    }
                )
            })
            .catch(err => PassThrough);
        }
    }
}