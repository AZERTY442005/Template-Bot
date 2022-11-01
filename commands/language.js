const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const fetch = require('node-fetch');
const {format: prettyFormat} = require('pretty-format');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const UserError = require("../Functions/UserError.js")
const Error = require("../Functions/Error.js")

module.exports = {
    name: 'language',
    description: {"fr": "Change la langue du Bot", "en": "Change the Bot's language"},
    aliases: ["langue", "lan", "lang"],
    usage: "language <new-language>",
    category: "Default",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"))
        const prefix = prefixes[message.guild.id].prefixes;
        let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
        let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"));
        if(!languages[message.guild.id]) {
            languages[message.guild.id] = "en"
        }
        try {
            if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("ADMINISTRATOR", bot, message, __filename)
            const ValidLanguages = ["fr", "en", "us"]
            const LanguagesList = {
                "fr": "Français",
                "en": "English",
                "us": "English"
            }
            if(!languages[message.guild.id]) {
                languages[message.guild.id] = "en"
            }
            if(!args[0]) return UserError(`SpecifyLanguage (${ValidLanguages.join(",")})`, bot, message, __filename)
            if(!ValidLanguages.includes(args[0])) return Error(`SpecifyValidLanguage (${ValidLanguages.join(",")})`, bot, message, __filename)
            if(args[0]=="us") args[0] = "en"
            languages[message.guild.id] = args[0]
            fs.writeFile("./DataBase/languages.json", JSON.stringify(languages), (err) => {
                if (err) console.error();
            })

            let Embed = new MessageEmbed()
                .setTitle(`${message_language[languages[message.guild.id]]["Language"]}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("BLUE")
                .addField(`${message_language[languages[message.guild.id]]["NewLanguage"]}`, `${LanguagesList[args[0]]}`)
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