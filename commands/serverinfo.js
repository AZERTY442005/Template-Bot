const { MessageEmbed } = require("discord.js")
const fs = require('fs')
const fetch = require('node-fetch');

module.exports = {
    name: 'serverinfo',
    description: {"fr": "Affiche les infos du serveur", "en": "Show server info"},
    aliases: [],
    usage: "serverinfo",
    category: "Utility",
    execute(message, args, guild) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
        let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"));
        if(!languages[message.guild.id]) {
            languages[message.guild.id] = "en"
        }
        try {
    //        message.channel.send(`__${message.guild.name}:__ \n ID: ${message.guild.id} \n Members: ${message.guild.memberCount} \n Icon: ${message.guild.icon} `);
    //        let image = message.guild.displayAvatarURL()
            let Embed = new MessageEmbed()
                .setTitle("SERVER INFO")
    //            .setColor("#15f153")
                .setColor("#7289DA")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
    //            .setImage(image)
                .addField(`${message_language[languages[message.guild.id]]["ServerName"]}`, message.guild.name)
                .addField(`${message_language[languages[message.guild.id]]["CreatedAt"]}`, message.guild.createdAt)
    //            .addField("You joined", message.guild.joinedAt)
                .addField(`${message_language[languages[message.guild.id]]["TotalMembers"]}`, message.guild.memberCount)
            message.channel.send(Embed)
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