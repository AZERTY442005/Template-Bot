const { MessageEmbed } = require("discord.js")
const fs = require("fs")
const fetch = require('node-fetch');

module.exports = {
    name: 'prefix',
    description: "Affiche le préfix",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            try {
                let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
                let prefix = prefixes[message.guild.id].prefixes
                let Embed = new MessageEmbed()
                .setTitle("PREFIX")
                .setColor("#FFCA2B")
                .setDescription(`Le préfix actuel est **${prefix}**`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                message.channel.send(Embed)
            } catch {
                message.lineReply("Erreur: Aucun préfix customisé...")
                message.lineReply("Préfix customisé créé avec succès")
            }
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