const { MessageEmbed } = require("discord.js")
const fs = require('fs')
const fetch = require('node-fetch');

module.exports = {
    name: 'serverinfo',
    description: "Affiche les infos du serveur",
    execute(message, args, guild) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
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
                .addField("Nom du serveur", message.guild.name)
                .addField("Créé le", message.guild.createdAt)
    //            .addField("You joined", message.guild.joinedAt)
                .addField("Total des membres", message.guild.memberCount)
            message.channel.send(Embed)
        } catch (error) { // ERROR PREVENTER
            console.error(`${error}`)
            message.lineReply(`Une erreur est survenue`)
            var URL = fs.readFileSync("./DataBase/webhook-logs-url", "utf8")
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