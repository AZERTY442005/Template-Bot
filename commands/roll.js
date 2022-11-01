const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch');
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'roll',
    description: {"fr": "Choisit un nombre aléatoire", "en": "Choose a random number"},
    aliases: [],
    usage: "roll (<nb>)",
    category: "Fun",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
        let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"));
        if(!languages[message.guild.id]) {
            languages[message.guild.id] = "en"
        }
        try {
            let number
            let faces
            if(!args[0]) {
                number = Math.floor(Math.random() * 6 + 1)
                faces = 6
            } else {
                if(!parseInt(args[0])) return UserError("InvalidNumber", bot, message, __filename)
                number = Math.floor(Math.random() * parseInt(args[0]) + 1)
                faces = args[0]
            }
            let EmbedRoll = new MessageEmbed()
            .setTitle(`ROLL`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(message.member.displayHexColor)
            // .setThumbnail(message.author.displayAvatarURL())
            .addField(`${message_language[languages[message.guild.id]]["Roll1"]} ${faces} ${message_language[languages[message.guild.id]]["Roll2"]}`, `${number}`)
            .setTimestamp()
            message.channel.send(EmbedRoll)
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