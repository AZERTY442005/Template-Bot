const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const fetch = require('node-fetch');
const {format: prettyFormat} = require('pretty-format');
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: '8ball',
    description: "Magic 8ball",
    aliases: [],
    usage: "8ball <wish>",
    category: "Fun",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"))
            const prefix = prefixes[message.guild.id].prefixes;
            if(!args[0]) return UserError("Vous devez spécifier le souhait", bot, message, __filename)
            const anwsers = [
                "Essaye plus tard",
                "Essaye encore",
                "Pas d'avis",
                "C'est ton destin",
                "Le sort en est jeté",
                "Une chance sur deux",
                "Repose ta question",
                "D'après moi oui",
                "C'est certain",
                "Oui absolument",
                "Tu peux compter dessus",
                "Sans aucun doute",
                "Très probable",
                "Oui ",
                "C'est bien parti",
                "C'est non",
                "Peu probable",
                "Faut pas rêver",
                "N'y compte pas",
                "Impossible ",
            ]
            // message.reply('`"'+args.slice(0).join(" ")+'"` '+anwsers[Math.floor(Math.random() * (anwsers.length - 1) + 1)])
            let Embed = new MessageEmbed()
                .setTitle("8BALL")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("GOLD")
                .addField(args.slice(0).join(" "), anwsers[Math.floor(Math.random() * (anwsers.length - 1) + 1)])
                .setTimestamp()
            message.lineReplyNoMention(Embed)
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