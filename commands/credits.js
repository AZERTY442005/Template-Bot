const { MessageEmbed } = require("discord.js");
const fs = require("fs")

module.exports = {
    name: 'credits',
    description: "Affiche mes credits",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            let avatar = config["BotInfo"]["IconURL"]
            let EmbedCredits = new MessageEmbed()
            .setTitle("CREDITS")
            .setThumbnail(avatar)
            .setColor("RANDOM")
            .addFields(
                {name:`Name`,value:`${config["BotInfo"]["name"]}`,inline:true},
                {name:`Version`,value:`${config["BotInfo"]["version"]}`,inline:true},
                {name:`Created at`,value:`${config["BotInfo"]["CreatedAt"]}`,inline:true},
                {name:`Creator`,value:"<@452454205056352266>",inline:true},
                {name:`Owner`,value:`<@${config["OwnerID"]}>`,inline:true},
            )
            .setFooter(`${config["BotInfo"]["name"]}`, `${config["BotInfo"]["IconURL"]}`)
            .setTimestamp()
            message.channel.send(EmbedCredits)
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