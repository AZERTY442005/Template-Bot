const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const fetch = require('node-fetch');
const {format: prettyFormat} = require('pretty-format');
const UserError = require("../../Functions/UserError.js")
const UserErrorNoPermissions = require("../../Functions/UserErrorNoPermissions.js")

module.exports = {
    name: 'oldlogs',
    description: "Journal d'évènements",
    aliases: [],
    usage: "oldlogs help",
    category: "Utility",
    execute(message, args, bot) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("Administrateur", bot, message, __filename)
            let logs = JSON.parse(fs.readFileSync("./DataBase/logs.json", "utf8"));
            if(!logs[message.guild.id]) logs[message.guild.id] = {}

            let modules = [
                "message-created", // MESSAGE
                "message-edited",
                "message-deleted",
                "message-reaction-added", // MESSAGE REACTION
                "message-reaction-removed",
                "message-reaction-removed-all",
                "member-joined", // MEMBER
                "member-left",
                "member-banned",
                "member-unbanned",
                "member-updated",
                "member-presence-update", // MEMBER STATS
                "user-updated",
                "typing-started", // TYPING
                "typing-stopped",
                "guild-updated", /// GUILD EDIT
                "channel-created", // CHANNELS
                "channel-edited",
                "channel-deleted",
                "channel-pins-updated",
                "emoji-created", // EMOJI
                "emoji-updated",
                "emoji-deleted",
                "role-created", // ROLE
                "role-updated",
                "role-deleted",
            ]
            let categories = {
                "message" : [
                    "message-created",
                    "message-edited",
                    "message-deleted",
                ],
                "message-reaction" : [
                    "message-reaction-added",
                    "message-reaction-removed",
                    "message-reaction-removed-all",
                ],
                "member" : [
                    "member-joined",
                    "member-left",
                    "member-banned",
                    "member-unbanned",
                    "member-updated",
                ],
                "member-stats" : [
                    "member-presence-update",
                    "user-updated",
                ],
                "typing" : [
                    "typing-started",
                    "typing-stopped",
                ],
                "guild-updated" : [
                    "guild-updated",
                ],
                "channel" : [
                    "channel-created",
                    "channel-edited",
                    "channel-deleted",
                    "channel-pins-updated",
                ],
                "emoji" : [
                    "emoji-created",
                    "emoji-updated",
                    "emoji-deleted",
                ],
                "role" : [
                    "role-created",
                    "role-updated",
                    "role-deleted",
                ],
            }

            for(let i=0;i<modules.length;i++) {
                logs[message.guild.id][modules[i]] = "off"
            }
            fs.writeFile("./DataBase/logs.json", JSON.stringify(logs), (err) => {
                if (err) console.error();
            });

            if(!args[0] || args[0]=="help" || !"helplistchannelonoff".includes(args[0])) {
                let EmbedHelp = new MessageEmbed()
                .setTitle("LOGS COMMANDS")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("GOLD")
                .addField(`${prefix}logs help`, `Affiche cette page`)
                .addField(`${prefix}logs list`, `Affiche La liste des modules de logs`)
                .addField(`${prefix}logs channel <channel-id>`, `Paramètre le salon d'envoie des logs`)
                .addField(`${prefix}logs <on/off> (<module/category>)`, `Active/Désactive un module ou une catégorie de logs`)
                .setTimestamp()
                message.channel.send(EmbedHelp)
            }
            if(args[0]=="list") {
                let fields = 0
                let EmbedList = new MessageEmbed()
                for(let i=0;i<Object.keys(categories).length;i++) {
                    EmbedList.setTitle(`LOGS LIST`)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    // console.log(EmbedList.title)
                    // .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor("GOLD")
                    // console.log(Object.keys(categories)[i])
                    // console.log(Object.values(categories)[i])
                    // .addField(`\u200b`, `__**${Object.keys(categories)[i]}**__`)
                    .addField(`\u200b`, `__**${Object.keys(categories)[i][0].toUpperCase() + Object.keys(categories)[i].substring(1)}**__`)
                    let j=0
                    for(j=0;j<Object.values(categories)[i].length;j++) {
                        fields++
                        EmbedList.addField(`${Object.values(categories)[i][j]}`, `${logs[message.guild.id][Object.values(categories)[i][j]]}`, inline=true)
                        if(fields>=25) {
                            message.channel.send(EmbedList)
                            EmbedList.spliceFields(0, 25)
                            fields = 0
                            EmbedList.title = ""
                            EmbedList.author = ""
                            EmbedList.setTimestamp()
                        }
                        
                    }
                }
                message.channel.send(EmbedList)
            }
            if(args[0]=="on" || args[0]=="off") {
                if(!args[1]) {
                    // TOGGLE ALL MODULES
                }
                if(Object.keys(categories).includes(args[1])) {
                    console.log("CATEGORY")
                    // TOGGLE CATEGORY
                } else if (modules.includes(args[1])) {
                    console.log("MODULE")
                    // TOGGLE MODULE
                } else {
                    UserError("Ce module ou cette catégorie n'est pas reconnue", bot, message, __filename)
                    return
                }

                let EmbedAdd = new MessageEmbed()
                .setTitle(`LOGS LIST`)
                .setColor("GOLD")
                .addField(`d`, `q`)
                .setTimestamp()
                        
                message.channel.send(EmbedAdd)
            }
            











            // let Embed = new MessageEmbed()
            //     .setTitle("8BALL")
            //     .setAuthor(message.author.tag, message.author.displayAvatarURL())
            //     .setColor("GOLD")
            //     .addField(args.slice(0).join(" "), anwsers[Math.floor(Math.random() * (anwsers.length - 1) + 1)])
            //     .setTimestamp()
            // message.lineReply(Embed)
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