const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const fetch = require('node-fetch');

module.exports = {
    name: 'invite',
    description: {"fr": "Envoie le lien d'invitation du bot", "en": "Send the bot invitation link"},
    aliases: [],
    usage: "invite",
    category: "Default",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
        let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"));
        if(!languages[message.guild.id]) {
            languages[message.guild.id] = "en"
        }
        try {
            const Embed = new MessageEmbed()
            .setTitle(`INVITE`)
            .setDescription(`${message_language[languages[message.guild.id]]["InviteLink"]}\nhttps://discord.com/api/oauth2/authorize?client_id=${config["BotInfo"]["ID"]}&permissions=8&scope=bot"`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setThumbnail(config["BotInfo"]["IconURL"])
            .setColor("AQUA")
            .setTimestamp()
            message.lineReplyNoMention(Embed)
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