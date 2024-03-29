const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const fetch = require('node-fetch');
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'report',
    description: {"fr": "Rapporte un membre", "en": "Report a member"},
    aliases: [],
    usage: "report <user> <reason>",
    category: "Moderation",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
        let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"));
        if(!languages[message.guild.id]) {
            languages[message.guild.id] = "en"
        }
        try {
            let UserReport = message.mentions.users.first()||null
            const ReasonReport = args.slice(1).join(" ");
            if(UserReport==null) return UserError("SpecifyUser", bot, message, __filename)
            if(!args[1]) return UserError("SpecifyReason", bot, message, __filename)
            message.delete()
            let AvatarReport = UserReport.displayAvatarURL()
            let ChannelReport = message.guild.channels.cache.find(channel => channel.name === "reports")
            console.log(ChannelReport)
            let EmbedReport = new MessageEmbed()
            .setTitle(`REPORT`)
            .setDescription(`${message_language[languages[message.guild.id]]["ReportDescription"]}`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
            .setColor("YELLOW")
            .setThumbnail(AvatarReport)
            .addFields(
                {name:`${message_language[languages[message.guild.id]]["Reporter"]}`,value:`${message.author.tag}`,inline:true},
                {name:`${message_language[languages[message.guild.id]]["Member"]}`,value:`${UserReport.tag}`,inline:true},
                {name:`${message_language[languages[message.guild.id]]["Reason"]}`,value:`${ReasonReport}`,inline:true},
            )
            .setTimestamp()
            if (ChannelReport == null) {
                message.channel.send(EmbedReport)
            } else {
                ChannelReport.send(EmbedReport)
            }
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