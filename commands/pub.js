const { MessageEmbed } = require("discord.js");
const fs = require('fs');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'pub',
    description: {"fr": "Envoie une publicité", "en": "Send an advertisement"},
    aliases: ["ad", "ads"],
    usage: "pub <title> <message>",
    category: "Utility",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
        let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"));
        if(!languages[message.guild.id]) {
            languages[message.guild.id] = "en"
        }
        try {
            if(!(message.member.hasPermission("MANAGE_MESSAGES") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("MANAGE_MESSAGES", bot, message, __filename)
            if(!args[0]) return UserError("SpecifyTitle", bot, message, __filename)
            if(!args[1]) return UserError("SpecifyMessage", bot, message, __filename)
            let title = args[0]
            let description = args.slice(1).join(" ");

            let Embed = new MessageEmbed()
                .setTitle(`${message_language[languages[message.guild.id]]["Ads"]}`)
                .addField(`${title}`, `${description}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor(message.member.displayHexColor)
                .setTimestamp()
            message.channel.send(Embed)
            message.delete()
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