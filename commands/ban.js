const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const Error = require("../Functions/Error.js")
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'ban',
    description: "Ban un utilisateur",
    aliases: [],
    usage: "ban <user> <reason>",
    category: "Moderation",
    execute(message, args, bot) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(!(message.member.hasPermission("BAN_MEMBERS") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("Bannir des Membres", bot, message, __filename)
            if(!args[0]) return UserError("Veuillez préciser un utilisateur", bot, message, __filename)
            const userBan = message.mentions.users.first();
            if(!userBan) return UserError("Veuillez préciser un utilisateur valide", bot, message, __filename)
            const member = message.guild.member(userBan);
            let reasonBan = args.slice(1).join(" ");
            // if(!reasonBan) reasonBan = 'Non spécifié';
            if(!reasonBan) return UserError("Veuillez préciser une raison", bot, message, __filename)
            if(!member) return UserError("Veuillez préciser un utilisateur valide", bot, message, __filename)
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
                    .setDescription(`Un utilisateur a été banni du serveur`)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor(`RED`)
                    .setThumbnail(AvatarBan)
                    .addFields(
                        {name:"Modérateur",value:`${message.author}`,inline:true},
                        {name:"Membre",value:`${userBan}`,inline:true},
                        {name:"Raison",value:`${reasonBan}`,inline:true},
                    )
                    .setTimestamp()
                message.channel.send(EmbedBan)
                message.delete()
            }).catch(error => {
                if(error=="DiscordAPIError: Missing Permissions") {
                    Error("Je n'ai pas les permissions suffisantes pour ban cet utilisateur", bot, message, __filename)
                } else {
                    Error("Impossible de ban cet utilisateur", bot, message, __filename)
                }
            })
        } catch (error) { // ERROR PREVENTER
            console.error(`${error}`)
            Embed = new MessageEmbed()
            .setTitle(`Une erreur est survenue`)
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