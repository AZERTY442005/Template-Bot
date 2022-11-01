const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const Error = require("../Functions/Error.js")
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'dm',
    description: {"fr": "Envoie un DM à un utilisateur", "en": "Send a DM to a user"},
    aliases: [],
    usage: "dm <user> <message>",
    category: "Utility",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("ADMINISTRATOR", bot, message, __filename)
            let dmUser = message.mentions.users.first();
            if(!args[0]) return UserError("SpecifyUser", bot, message, __filename)
            if(!dmUser) return Error("SpecifyValidUser", bot, message, __filename)
            //if(dmUser.id == "782885398316711966") return message.channel.send("ERREUR: Veuillez préciser un utilisateur valide (pas moi de préférence)")
            if(!args[1]) return UserError("SpecifyMessage", bot, message, __filename)
            const dmMessage = args.slice(1).join(" ");
            // dmUser.send(`__Message de ${message.author} provenant de **${message.guild.name}**__\n${dmMessage}`)

            let Embed = new MessageEmbed()
            .setTitle(`__Message Privé__`)
            .setColor("AQUA")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`**Message de ${message.author} provenant de *${message.guild.name}***`)
            .addField(`\u200b`, `${dmMessage}`)
            .setTimestamp()
            dmUser.send(Embed)
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