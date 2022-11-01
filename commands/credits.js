const { MessageEmbed } = require("discord.js");
const fs = require("fs")

module.exports = {
    name: 'credits',
    description: {"fr": "Affiche mes credits", "en": "Show my credits"},
    aliases: ["version", "bot", "info", "botinfo", "ver"],
    usage: "credits",
    category: "Default",
    execute(message, args, bot) {
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
                {name:`Updated at`,value:`${config["BotInfo"]["UpdatedAt"]}`,inline:true},
                {name:`Created at`,value:`${config["BotInfo"]["CreatedAt"]}`,inline:true},
                {name:`Creator`,value:"<@452454205056352266>",inline:true},
                {name:`Owner`,value:`<@${config["OwnerID"]}>`,inline:true},
            )
            .setFooter(`${config["BotInfo"]["name"]}`, `${config["BotInfo"]["IconURL"]}`)
            .setTimestamp()
            message.channel.send(EmbedCredits)
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