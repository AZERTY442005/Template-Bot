const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const fetch = require('node-fetch');
const {format: prettyFormat} = require('pretty-format');
const UserError = require("../../Functions/UserError.js")
const Error = require("../../Functions/Error.js")
const UserErrorNoPermissions = require("../../Functions/UserErrorNoPermissions.js")

module.exports = {
    name: 'logs',
    description: {"fr": "Journal d'évènements", "en": "Event Log"},
    aliases: [],
    usage: "logs help",
    category: "Utility",
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
            // if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Administrateur)")
            // if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return Error("Vous n'avez pas la permission de faire ceci! (Administrateur)", bot, message, __filename)
            if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("ADMINISTRATOR", bot, message, __filename)
            let logs = JSON.parse(fs.readFileSync("./DataBase/logs.json", "utf8"))
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
                if(!logs[message.guild.id][modules[i]]) logs[message.guild.id][modules[i]] = "off"
            }
            fs.writeFile("./DataBase/logs.json", JSON.stringify(logs, null, 4), (err) => {
                if (err) console.error();
            });

            if(!args[0] || args[0]=="help" || !"helplistchannelonoff".includes(args[0])) {
                let EmbedHelp = new MessageEmbed()
                .setTitle("LOGS COMMANDS")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("GOLD")
                .addField(`${prefix}logs help`, `${message_language[languages[message.guild.id]]["LogsSyntaxHelp"]}`)
                .addField(`${prefix}logs list`, `${message_language[languages[message.guild.id]]["LogsSyntaxList"]}`)
                .addField(`${prefix}logs channel <channel-id>`, `${message_language[languages[message.guild.id]]["LogsSyntaxChannel"]}`)
                .addField(`${prefix}logs <on/off> (<module/category>)`, `${message_language[languages[message.guild.id]]["LogsSyntaxOnOff"]}`)
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
                let EmbedAdd = new MessageEmbed()
                
                if(!args[1]) {
                    console.log("ALL")
                    // TOGGLE ALL MODULES
                    EmbedAdd.setDescription(`${message_language[languages[message.guild.id]]["AllModulesUpdated"]} ${args[0]}`)
                    for(let i=0;i<modules.length;i++) {
                        logs[message.guild.id][modules[i]] = args[0]
                    }
                } else if(Object.keys(categories).includes(args[1])) {
                    console.log("CATEGORY")
                    // TOGGLE CATEGORY
                    console.log(prettyFormat(Object.keys(categories)))
                    console.log(categories[args[1]])
                    EmbedAdd.setDescription(`${message_language[languages[message.guild.id]]["TheCategory"]} ${args[1][0].toUpperCase() + args[1].substring(1)} ${message_language[languages[message.guild.id]]["WasTurned"]} ${args[0]}`)
                    for(let i=0;i<categories[args[1]].length;i++) {
                        console.log(logs[message.guild.id][categories[args[1]][i]])
                        logs[message.guild.id][categories[args[1]][i]] = args[0]
                    }
                } else if (modules.includes(args[1])) {
                    console.log("MODULE")
                    // TOGGLE MODULE
                    EmbedAdd.setDescription(`${message_language[languages[message.guild.id]]["TheModule"]} ${args[1][0].toUpperCase() + args[1].substring(1)} ${message_language[languages[message.guild.id]]["WasTurned"]} ${args[0]}`)
                    logs[message.guild.id][modules[args[1]]] = args[0]
                } else {
                    Error("UnknownModuleCategory", bot, message, __filename)
                    return
                }
                
                fs.writeFile("./DataBase/logs.json", JSON.stringify(logs, null, 4), (err) => {
                if (err) console.error();
                });
                
                
                EmbedAdd.setTitle(`LOGS UPDATED`)
                .setColor("GOLD")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                // .addField(`${args[1]}`, `${args[0]}`)
                .setTimestamp()
                        
                message.channel.send(EmbedAdd)
            }
            if(args[0]=="channel") {
                if(!args[1]) return UserError("SpecifyChannelID", bot, message, __filename)
                channel = message.guild.channels.cache.get(args[1])
                if(!channel) return SpecifyValidChannelIDError("", bot, message, __filename)
                
                logs[message.guild.id]["channel"] = args[1]
                
                let EmbedChannel = new MessageEmbed()
                .setTitle(`LOGS CHANNEL`)
                .setColor("GOLD")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .addField(`${message_language[languages[message.guild.id]]["LogsChannelUpdated"]}`, `<#${args[1]}>`)
                .setTimestamp()
                message.channel.send(EmbedChannel)
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
            .catch(() => PassThrough);
        }
    }
}