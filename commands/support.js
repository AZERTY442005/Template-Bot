const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const UserError = require("../Functions/UserError.js")
const Error = require("../Functions/Error.js")
const Success = require("../Functions/Success.js")

module.exports = {
    name: 'support',
    description: {"fr": "Affiche une page de support", "en": "Displays a support page"},
    aliases: [],
    usage: "support",
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
            if(!args[0]) {
                let Embed = new MessageEmbed()
                .setTitle("SUPPORT")
                .setDescription(`Pour toute questions ou demandes, rendez-vous sur le [Serveur de support](https://discord.gg/vWDzFa6dFN)`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("AQUA")
                .addField(`Les questions plus posées`, `${prefix}support FAQ`)
                .addField(`Feedback`, `${prefix}feedback`)
                .addField(`Contact`, `developer.enoal.fauchille@gmail.com`)
                .setTimestamp()
                message.channel.send(Embed)
            }
            if(args[0] && args[0].toLowerCase() == "faq") {
                let Embed = new MessageEmbed()
                .setTitle("SUPPORT FAQ")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("AQUA")
                .addField(`Quelles sont les fonctionnalitées disponibles ?`, `Pour voir ceci, vous pouvez taper la commande \`${prefix}help\``)
                // .addField(``, ``)
                .addField(`\u200b`, `Vous pouvez suggérer des questions sur le [Serveur de support](https://discord.gg/vWDzFa6dFN) ou en utilisant \`${prefix}feedback <msg>\``)
                .setTimestamp()
                message.channel.send(Embed)
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