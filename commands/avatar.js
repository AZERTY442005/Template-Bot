const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const fetch = require('node-fetch');
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'avatar',
    description: {"fr": "Montre l'avatar d'un utilisateur", "en": "Shows a user's avatar"},
    aliases: [],
    usage: "avatar (<user>)",
    category: "Utility",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            let user;
            try{
                if (message.mentions.users.first()) {
                    user = message.mentions.users.first();
                } else {
                    user = message.author;
                }


                let avatar = user.displayAvatarURL({size: 4096, dynamic: true});
                // 4096 is the new biggest size of the avatar.
                // Enabling the dynamic, when the user avatar was animated/GIF, it will result as a GIF format.
                // If it's not animated, it will result as a normal image format.

                const embed = new MessageEmbed()
                    .setTitle(`Avatar de ${user.tag}`)
                    .setDescription(`[URL de l'avatar de **${user.tag}**](${avatar})`)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor("0x1d1d1d")
                    .setImage(avatar)
                    .setTimestamp()
            
            return message.channel.send(embed);
            } catch {
                return UserError("InvalidMention", bot, message, __filename)
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