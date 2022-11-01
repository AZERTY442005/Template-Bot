const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const Error = require("../Functions/Error.js")
const UserError = require("../Functions/UserError.js")

function getBannedIdFromMention(mention) {
    if (!mention) return;
    if (mention.startsWith('<@!') && mention.endsWith('>')) {
        mention = mention.slice(3, -1);
        // if (mention.startsWith('!')) mention = mention.slice(1);
        return mention;
    }
}

module.exports = {
    name: "unban",
     description: {"fr": "Débanni un membre", "en": "Unban a member"},
    aliases: [],
    usage: "unban <userID> (<reason>)",
    category: "Moderation",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(!(message.member.hasPermission("BAN_MEMBERS") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("BAN_MEMBERS", bot, message, __filename)
            if(!args[0]) return UserError("SpecifyUserID", bot, message, __filename)


            let reason = args.slice(1).join(" ");
            if(!reason) reason = 'Non spécifié';

            // let userMention = message.mentions.users.first()
            let userID
            userID = getBannedIdFromMention(args[0]) || args[0]

            
            const banembed = new MessageEmbed()
            .setTitle('UNBAN')
            .setDescription(`Un utilisateur a été débanni du serveur`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("#00C632")
            .addFields(
                {name:'Modérateur',value:message.author,inline:true},
                {name:'Membre',value:"<@"+userID+">",inline:true},
                {name:'Raison',value:reason,inline:true},
            )
            .setTimestamp()

            message.guild.fetchBans().then(bans=> {
            if(bans.size == 0) return Error("NoUserIsBanned", bot, message, __filename)
            let bUser = bans.find(b => b.user.id == userID)
            if(!bUser) return Error("ThisUserIsNotBanned", bot, message, __filename)
            message.guild.members.unban(bUser.user, `${message.author.tag}: ${reason}`)
            message.delete()
            message.channel.send(banembed);
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