const { MessageEmbed } = require("discord.js")
const fs = require('fs')
const fetch = require('node-fetch');

module.exports = {
    name: 'ping',
    description: {"fr": "Calcule le ping du Bot", "en": "Calculates the Bot's ping"},
    aliases: [],
    usage: "ping",
    category: "Default",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            // message.channel.send("Calculating ping...").then((resultMessage) => {
            //     const ping = resultMessage.createdTimestamp - message.createdTimestamp
            //     message.lineReplyNoMention(`Pong !!! **${ping}ms**`)
            // })
            const Embed = new MessageEmbed()
            .setTitle(`PING`)
            .setDescription(`${bot.ws.ping} ms`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("GREEN")
            .setTimestamp()
            message.lineReplyNoMention(Embed)
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