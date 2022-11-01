const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const UserError = require("../Functions/UserError.js")
const Error = require("../Functions/Error.js")
const Success = require("../Functions/Success.js")

const FeedbackCooldown = new Set()

module.exports = {
    name: 'feedback',
    description: {"fr": "Envoie un retour d'utilisation au développeur", "en": "Send a return of use to the developer"},
    aliases: ["fb"],
    usage: "feedback <message>",
    category: "Default",
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
            if(!args[0]) return UserError("SpecifyMessage", bot, message, __filename)

            if (FeedbackCooldown.has(message.author.id) && !message.member.hasPermission("ADMINISTRATOR")) { // Command Cooldown
                const Embed = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription(`:alarm_clock: ${message_language[languages[message.guild.id]]["WaitFeedback"]}`)
                .setColor("ORANGE")
                message.lineReplyNoMention(Embed)
            } else {
                var URL = fs.readFileSync("./DataBase/webhook-logs-url.txt", "utf8") // Webhook Logs System
                fetch(URL, {
                    "method":"POST",
                    "headers": {"Content-Type": "application/json"},
                    "body": JSON.stringify(
                        {
                            "username": `${config["BotInfo"]["name"]} Logs`,
                            "avatar_url": `${config["BotInfo"]["IconURL"]}`,
                            "content": `<@${config["CreatorID"]}>`,
                            "embeds": [
                            {
                                "title": "__Feedback__",
                                "color": 1752220,
                                "timestamp": new Date(),
                                "author": {
                                    "name": `${message.author.username}`,
                                    "icon_url": `${message.author.displayAvatarURL()}`,
                                },
                                "description": `${args.slice(0).join(" ")}`
                            }
                            ]
                        }
                    )
                })
                .catch(err => PassThrough);

                Success("SentSuccess", bot, message, __filename)

                // UPDATE COOLDOWN
                FeedbackCooldown.add(message.author.id);
                setTimeout(() => {
                    FeedbackCooldown.delete(message.author.id);
                }, 300000); // DELAY
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