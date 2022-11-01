const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'announce',
    description: {"fr": "Envoie un message d'annonce", "en": "Send an announcement message"},
    aliases: [],
    usage: "announce <msg>",
    category: "Utility",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
            let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"));
            if(!languages[message.guild.id]) {
                languages[message.guild.id] = "en"
            }
            if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("ADMINISTRATOR", bot, message, __filename)
            if(!args[0]) UserError("SpecifyMessage", bot, message, __filename)
            message.delete()
            argsresult = args.slice(0).join(" ");
            let EmbedEmbed = new MessageEmbed()
                .setTitle(`${message_language[languages[message.guild.id]]["Announcement"]}`)
                .setDescription(`${argsresult}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("RANDOM")
                .setTimestamp()
                message.channel.send(EmbedEmbed)
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