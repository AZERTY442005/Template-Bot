const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'warns',
    description: {"fr": "Permet de gérer les avertissements d'un utilisateur", "en": "Allows you to manage user's warns"},
    aliases: [],
    usage: "warns help",
    category: "Moderation",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes
        let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
        let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"));
        if(!languages[message.guild.id]) {
            languages[message.guild.id] = "en"
        }
        try {
            if(!(message.member.hasPermission("KICK_MEMBERS") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("KICK_MEMBERS", bot, message, __filename)
            
            let warns = JSON.parse(fs.readFileSync("./DataBase/warns.json", "utf8"));

            if(!args[0] || args[0] == "help") {
                let EmbedHelp = new MessageEmbed()
                .setTitle(`WARNS COMMANDS`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("ORANGE")
                .addField(`${prefix}warns help`, `${message_language[languages[message.guild.id]]["warnsSyntaxHelp"]}`)
                .addField(`${prefix}warns <user>`, `${message_language[languages[message.guild.id]]["warnsSyntaxUser"]}`)
                .addField(`${prefix}warns <user> add`, `${message_language[languages[message.guild.id]]["warnsSyntaxAdd"]}`)
                .addField(`${prefix}warns <user> remove`, `${message_language[languages[message.guild.id]]["warnsSyntaxRemove"]}`)
                .addField(`${prefix}warns <user> clear`, `${message_language[languages[message.guild.id]]["warnsSyntaxClear"]}`)
                .addField(`${prefix}warns clear-all`, `${message_language[languages[message.guild.id]]["warnsSyntaxClearall"]}`)
                .setTimestamp()
                message.channel.send(EmbedHelp)
                return
            }
            if(args[0] == "clear-all") {
                
                warns[message.guild.id] = {}
                fs.writeFile("./DataBase/warns.json", JSON.stringify(warns), (err) => {
                    if (err) console.error();
                })
                let EmbedClearAll = new MessageEmbed()
                .setTitle(`WARNS CLEAR-ALL`)
                .setDescription(`${message_language[languages[message.guild.id]]["AllWarnsWas"]} **supprimés** ${message_language[languages[message.guild.id]]["By"]} ${message.author}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("ORANGE")
                .setTimestamp()
                message.channel.send(EmbedClearAll)
                return
            }
            
            let User = message.mentions.users.first()||null

            if(!User) Error("SpecifyValidUser", bot, message, __filename)

            if(!warns[message.guild.id]) warns[message.guild.id]={};
            if(!warns[message.guild.id][User.id]) {
                warns[message.guild.id][User.id] = {
                    warns: 0,
                }
                fs.writeFile("./DataBase/warns.json", JSON.stringify(warns), (err) => {
                    if (err) console.error();
                })
            }
            
            
            const UserWarns = parseInt(warns[message.guild.id][User.id].warns)

            if(!args[1]) {
                // message.channel.send(`${User} a actuellement **${warns[message.guild.id][User.id].warns} warns**`)
                let EmbedDisplay = new MessageEmbed()
                .setTitle(`WARNS`)
                .setDescription(`${User} ${message_language[languages[message.guild.id]]["CurrentlyHas"]} **${warns[message.guild.id][User.id].warns} warns**`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("ORANGE")
                .setTimestamp()
                message.channel.send(EmbedDisplay)
            }
            if(args[1] == "clear") {
                warns[message.guild.id][User.id] = {
                    warns: 0,
                }
                fs.writeFile("./DataBase/warns.json", JSON.stringify(warns), (err) => {
                    if (err) console.error();
                })
                
                // message.channel.send(`Tout les warns de ${User} ont été supprimés`)
                let EmbedClear = new MessageEmbed()
                .setTitle(`WARNS CLEAR`)
                .setDescription(`${message_language[languages[message.guild.id]]["AllWarnsOf"]} ${User} ${message_language[languages[message.guild.id]]["WasDeleted"]} ${message_language[languages[message.guild.id]]["By"]} ${message.author}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("ORANGE")
                .setTimestamp()
                message.channel.send(EmbedClear)
                return
            }
            if(args[1] == "remove") {
                message.delete()
                if(!args[2]) return UserError("SpecifyNumber", bot, message, __filename)
                const oldwarns = warns[message.guild.id][User.id].warns
                warns[message.guild.id][User.id] = {
                    warns: UserWarns - parseInt(args[2]),
                }
                fs.writeFile("./DataBase/warns.json", JSON.stringify(warns), (err) => {
                    if (err) console.error();
                })
                
                // message.channel.send(`${args[2]} warns de ${User} ont été supprimés\nActuellement à ${warns[message.guild.id][User.id].warns} warns`)
                let EmbedRemove = new MessageEmbed()
                .setTitle(`WARNS UPDATE`)
                .setDescription(`${message_language[languages[message.guild.id]]["WarnsOf"]} ${User} ${message_language[languages[message.guild.id]]["WasUpdatedFrom"]} **${oldwarns}** ${message_language[languages[message.guild.id]]["To"]} **${warns[message.guild.id][User.id].warns}**`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("ORANGE")
                .setTimestamp()
                message.channel.send(EmbedRemove)
            }
            if(args[1] == "add") {
                message.delete()
                if(!args[2]) return UserError("SpecifyNumber", bot, message, __filename)
                const oldwarns = warns[message.guild.id][User.id].warns
                warns[message.guild.id][User.id] = {
                    warns: UserWarns + parseInt(args[2]),
                }
                fs.writeFile("./DataBase/warns.json", JSON.stringify(warns), (err) => {
                    if (err) console.error();
                })
                
                // message.channel.send(`${args[2]} warns de ${User} ont été ajoutés\nActuellement à ${warns[message.guild.id][User.id].warns} warns`)
                let EmbedAdd = new MessageEmbed()
                .setTitle(`WARNS UPDATE`)
                .setDescription(`${message_language[languages[message.guild.id]]["WarnsOf"]} ${User} ${message_language[languages[message.guild.id]]["WasUpdatedFrom"]} **${oldwarns}** ${message_language[languages[message.guild.id]]["To"]} **${warns[message.guild.id][User.id].warns}**`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("ORANGE")
                .setTimestamp()
                message.channel.send(EmbedAdd)
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