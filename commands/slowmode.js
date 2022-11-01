const { MessageEmbed } = require("discord.js")
const fs = require("fs")
const ms = require('ms');
const fetch = require('node-fetch');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'slowmode',
    description: {"fr": "Bascule le mode lent", "en": "Toggle Slowmode"},
    aliases: [],
    usage: "slowmode <time>",
    category: "Moderation",
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
            if(!(message.member.hasPermission("MANAGE_CHANNELS") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("MANAGE_CHANNELS", bot, message, __filename)
            if(!args[0]) return UserError("SpecifyDuration", bot, message, __filename)
            // let time_seconds = args[0]
            
            const time = ms(args[0]) / 1000 // TEST

            let reason = args.slice(1).join(" ");
            if(!reason) reason = 'Non spécifié';
            if(time < 0 || time > 21600 || Number.isNaN(time)) return UserError("SpecifyDurationBetween0and21600", bot, message, __filename)
            message.delete()
            message.channel.setRateLimitPerUser(time, `${message.author.tag}: ${reason}`)
            let Embed = new MessageEmbed()
            .setTitle("SLOWMODE")
            .setDescription(`Le Slowmode a changé`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("#B200FF")
            .setThumbnail(message.author.displayAvatarURL())
            .addFields(
                {name:`${message_language[languages[message.guild.id]]["Time"]}`,value:`${args[0]}`,inline:true},
                {name:`${message_language[languages[message.guild.id]]["Reason"]}`,value:`${reason}`,inline:true},
                {name:`${message_language[languages[message.guild.id]]["Moderator"]}`,value:`${message.author}`,inline:true},
            )
            .setTimestamp()
            message.channel.send(Embed)
            return
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