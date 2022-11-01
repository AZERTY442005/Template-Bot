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
    description: "Verrouille un salon",
    aliases: [],
    usage: "lock <reason> (<role>)",
    category: "Moderation",
    execute(message, args, bot) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(!(message.member.hasPermission("MANAGE_CHANNELS") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("Gérer les salons", bot, message, __filename)
            if(!args[0]) return UserError("Veuillez préciser la raison", bot, message, __filename)
            let Embed = new MessageEmbed()
            .setTitle("LOCK CHANNEL")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("GREEN")
            .setTimestamp()
            if(args[1]) {
                const role = message.guild.roles.cache.find(role => role.name === args[1]) || message.guild.roles.cache.find(role => role.id === getRoleIdFromMention(args[1]))
                if(!role) return UserError("Role inconnu", bot, message, __filename)
                if(message.channel.permissionsFor(role).has("SEND_MESSAGES")) { 
                    message.channel.updateOverwrite(role, { SEND_MESSAGES: false }, `${message.author.tag}: ${args[0]}`)
                    Embed.setDescription(`Ce salon a été verrouillé pour ${role}`)
                } else {
                    // message.channel.permissionOverwrites.delete(message.author.id);
                    message.channel.updateOverwrite(role, { SEND_MESSAGES: true }, `${message.author.tag}: ${args[0]}`)
                    Embed.setDescription(`Ce salon a été déverrouillé pour ${role}`)
                }
            } else {
                if(message.channel.permissionsFor(message.guild.id).has("SEND_MESSAGES")) { 
                    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: false }, `${message.author.tag}: ${args[0]}`)
                    Embed.setDescription(`Ce salon a été verrouillé pour @everyone`)
                } else {
                    // message.channel.permissionOverwrites.delete(message.author.id);
                    message.channel.updateOverwrite(message.channel.guild.roles.everyone, { SEND_MESSAGES: true }, `${message.author.tag}: ${args[0]}`)
                    Embed.setDescription(`Ce salon a été déverrouillé pour @everyone`)
                }
            }
            Embed.addField(`Raison`, `${args[0]}`)
            message.delete()
            message.channel.send(Embed)
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