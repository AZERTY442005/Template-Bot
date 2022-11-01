const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const UserError = require("../Functions/UserError.js")

function getRoleIdFromMention(mention) {
    if (!mention) return;
    if (mention.startsWith('<@&') && mention.endsWith('>')) {
        mention = mention.slice(3, -1);
        if (mention.startsWith('!')) mention = mention.slice(1);
        return mention;
    }
}

module.exports = {
    name: 'lock',
    description: {"fr": "Verrouille un salon", "en": "Lock a Channel"},
    aliases: [],
    usage: "lock <reason> (<role>)",
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
            if(!args[0]) return UserError("SpecifyReason", bot, message, __filename)
            let Embed = new MessageEmbed()
            .setTitle("LOCK CHANNEL")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("GREEN")
            .setTimestamp()
            if(args[1]) {
                const role = message.guild.roles.cache.find(role => role.name === args[1]) || message.guild.roles.cache.find(role => role.id === getRoleIdFromMention(args[1]))
                if(!role) return UserError("UnknownRole", bot, message, __filename)
                if(message.channel.permissionsFor(role).has("SEND_MESSAGES")) { 
                    message.channel.updateOverwrite(role, { SEND_MESSAGES: false }, `${message.author.tag}: ${args[0]}`)
                    Embed.setDescription(`${message_language[languages[message.guild.id]]["ChannelLockedFor"]} ${role}`)
                } else {
                    // message.channel.permissionOverwrites.delete(message.author.id);
                    message.channel.updateOverwrite(role, { SEND_MESSAGES: true }, `${message.author.tag}: ${args[0]}`)
                    Embed.setDescription(`${message_language[languages[message.guild.id]]["ChannelLockedFor"]} ${role}`)
                }
            } else {
                if(message.channel.permissionsFor(message.guild.id).has("SEND_MESSAGES")) { 
                    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false }, `${message.author.tag}: ${args[0]}`)
                    Embed.setDescription(`${message_language[languages[message.guild.id]]["ChannelLockedFor"]} @everyone`)
                } else {
                    // message.channel.permissionOverwrites.delete(message.author.id);
                    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true }, `${message.author.tag}: ${args[0]}`)
                    Embed.setDescription(`${message_language[languages[message.guild.id]]["ChannelLockedFor"]} @everyone`)
                }
            }
            Embed.addField(`${message_language[languages[message.guild.id]]["Reason"]}`, `${args[0]}`)
            message.delete()
            message.channel.send(Embed)
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