const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const Error = require("../Functions/Error.js")
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'ban',
    description: {"fr": "Ban un utilisateur", "en": "Ban a user"},
    aliases: [],
    usage: "ban <user> <reason>",
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
            if(!(message.member.hasPermission("BAN_MEMBERS") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("BAN_MEMBERS", bot, message, __filename)
            if(!args[0]) return UserError("SpecifyUser", bot, message, __filename)
            const userBan = message.mentions.users.first();
            if(!userBan) return Error("SpecifyValidUser", bot, message, __filename)
            const member = message.guild.member(userBan);
            let reasonBan = args.slice(1).join(" ");
            // if(!reasonBan) reasonBan = 'Non spécifié';
            if(!reasonBan) return UserError("SpecifyReason", bot, message, __filename)
            if(!member) return Error("SpecifyValidUser", bot, message, __filename)
            // console.log(typeof message.author.tag)
            // console.log(typeof reasonBan)
            const ReasonLogs = message.author.tag+": "+reasonBan
            // console.log(typeof ReasonLogs)
            // member.ban(ReasonLogs).then(() =>{
            // member.ban("HEYHDIUKQSG").then(() =>{
            member.ban().then(() =>{
                let AvatarBan = userBan.displayAvatarURL()
                let EmbedBan = new MessageEmbed()
                    .setTitle(`BAN`)
                    .setDescription(`${message_language[languages[message.guild.id]]["BanDescription"]}`)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor(`RED`)
                    .setThumbnail(AvatarBan)
                    .addFields(
                        {name:`${message_language[languages[message.guild.id]]["Moderator"]}`,value:`${message.author}`,inline:true},
                        {name:`${message_language[languages[message.guild.id]]["Member"]}`,value:`${userBan}`,inline:true},
                        {name:`${message_language[languages[message.guild.id]]["Reason"]}`,value:`${reasonBan}`,inline:true},
                    )
                    .setTimestamp()
                message.channel.send(EmbedBan)
                message.delete()
            }).catch(error => {
                if(error=="DiscordAPIError: Missing Permissions") {
                    Error("NoPermissionsToBan", bot, message, __filename)
                } else {
                    Error("UnableToBan", bot, message, __filename)
                }
            })
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