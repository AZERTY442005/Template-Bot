const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const Error = require("../Functions/Error.js")
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'kick',
    description: {"fr": "Kick un utilisateur", "en": "Kick a user"},
    aliases: [],
    usage: "kick <user> <reason>",
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
            if(!(message.member.hasPermission("KICK_MEMBERS") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("KICK_MEMBERS", bot, message, __filename)
            if(!args[0]) return UserError("SpecifyUser", bot, message, __filename)
            const userKick = message.mentions.users.first();
            if(!userKick) return Error("SpecifyValidUser", bot, message, __filename)
            const member = message.guild.member(userKick);
            let reasonKick = args.slice(1).join(" ");
            // if(!reasonKick) reasonKick = 'Non spécifié';
            if(!reasonKick) return UserError("SpecifyReason", bot, message, __filename)
            if(!member) return Error("SpecifyValidUser", bot, message, __filename)
            // message.author.send("pjmqldg")
            // userKick.send("iosqhd") //ERROR
            member.kick(`${message.author.tag}: ${reasonKick}`).then(() =>{
                let AvatarKick = userKick.displayAvatarURL()
                let EmbedKick = new MessageEmbed()
                    .setTitle(`KICK`)
                    .setDescription(`${message_language[languages[message.guild.id]]["KickDescription"]}`)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor("ORANGE")
                    .setThumbnail(AvatarKick)
                    .addFields(
                        {name:`${message_language[languages[message.guild.id]]["Moderator"]}`,value:`${message.author}`,inline:true},
                        {name:`${message_language[languages[message.guild.id]]["Member"]}`,value:`${userKick}`,inline:true},
                        {name:`${message_language[languages[message.guild.id]]["Reason"]}`,value:`${reasonKick}`,inline:true},
                    )
                    .setTimestamp()
                message.channel.send(EmbedKick)
                message.delete()
            }).catch(error => {
                if(error=="DiscordAPIError: Missing Permissions") {
                    Error("NoPermissionsToKick", bot, message, __filename)
                } else {
                    Error("UnableToKick", bot, message, __filename)
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