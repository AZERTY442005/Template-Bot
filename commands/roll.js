const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch');

module.exports = {
    name: 'roll',
    description: "Choisit un nombre aléatoire entre 1 et 6",
    usage: "roll (<nb>)",
    category: "Fun",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            let number
            let faces
            if(!args[0]) {
                number = Math.floor(Math.random() * 6 + 1)
                faces = 6
            } else {
                if(!parseInt(args[0])) return message.lineReply(`Erreur: Nombre invalide\n*${prefix}roll (<number>)*`)
                number = Math.floor(Math.random() * parseInt(args[0]) + 1)
                faces = args[0]
            }
            let EmbedRoll = new MessageEmbed()
            .setTitle(`ROLL`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(message.member.displayHexColor)
            // .setThumbnail(message.author.displayAvatarURL())
            .addField(`Dé à ${faces} faces`, `${number}`)
            .setTimestamp()
            message.channel.send(EmbedRoll)
        } catch (error) { // ERROR PREVENTER
            console.error(`${error}`)
            message.lineReply(`Une erreur est survenue`)
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