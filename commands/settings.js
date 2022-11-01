const { MessageEmbed } = require("discord.js")
const fs = require("fs");
const fetch = require('node-fetch');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const UserError = require("../Functions/UserError.js")
const CustomUserError = require("../Functions/CustomUserError.js")
// const { relativeTimeRounding } = require("moment");

module.exports = {
    name: "settings",
    description: {"fr": "Paramètres", "en": "Settings"},
    aliases: ["s", "set", "setting"],
    usage: "settings help",
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
            if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("ADMINISTRATOR", bot, message, __filename)
            // HELP
            if(!args[0] || args[0] == "help" || !"helpinfoprefixjoin-messageleave-messageauto-react".includes(args[0])){
                let Embed = new MessageEmbed()
                    .setTitle("__SETTINGS COMMANDS LIST__")
                    .setColor("#CA0000")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTimestamp()
                    .addField(`${prefix}s help`, `${message_language[languages[message.guild.id]]["sSyntaxHelp"]}`)
                    .addField(`${prefix}s info`, `${message_language[languages[message.guild.id]]["sSyntaxInfo"]}`)
                    .addField(`${prefix}s prefix <new-prefix>`, `${message_language[languages[message.guild.id]]["sSyntaxPrefix"]}`)
                    .addField(`${prefix}s join-message <action> <value>`, `${message_language[languages[message.guild.id]]["sSyntaxJoinMessage"]}\n*${prefix}s join-message help*`)
                    .addField(`${prefix}s leave-message <action> <value>`, `${message_language[languages[message.guild.id]]["sSyntaxLeaveMessage"]}\n*${prefix}s leave-message help*`)
                    .addField(`${prefix}s auto-react <on/off>`, `${message_language[languages[message.guild.id]]["sSyntaxAutoReact"]}`)
                    message.channel.send(Embed)
            }
            if(args[0] == "info"){
                let join_message_status = JSON.parse(fs.readFileSync("./DataBase/join-message-status.json", "utf8"))
                if(!join_message_status[message.guild.id]) {
                    join_message_status[message.guild.id] = {
                        join_message_status: "off"
                    }
                    fs.writeFile("./DataBase/join-message-status.json", JSON.stringify(join_message_status), (err) => {
                        if (err) console.error();
                    });
                }
                let join_message_status_guild
                try {
                    join_message_status_guild = join_message_status[message.guild.id].join_message_status
                } catch {
                    join_message_status_guild = "None"
                }

                let join_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/join-message-channel-id.json", "utf8"))
                let join_message_channel_id_guild
                try {
                    join_message_channel_id_guild = join_message_channel_id[message.guild.id].join_message_channel_id
                } catch {
                    join_message_channel_id_guild = "None"
                }
                
                let leave_message_status = JSON.parse(fs.readFileSync("./DataBase/leave-message-status.json", "utf8"))
                if(!leave_message_status[message.guild.id]) {
                    leave_message_status[message.guild.id] = {
                        leave_message_status: "off"
                    }
                    fs.writeFile("./DataBase/leave-message-status.json", JSON.stringify(leave_message_status), (err) => {
                        if (err) console.error();
                    });
                }
                let leave_message_status_guild
                try {
                    leave_message_status_guild = leave_message_status[message.guild.id].leave_message_status
                } catch {
                    leave_message_status_guild = "None"
                }

                let leave_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/leave-message-channel-id.json", "utf8"))
                let leave_message_channel_id_guild
                try {
                    leave_message_channel_id_guild = leave_message_channel_id[message.guild.id].leave_message_channel_id
                } catch {
                    leave_message_channel_id_guild = "None"
                }

                let auto_react = JSON.parse(fs.readFileSync("./DataBase/auto-react.json", "utf8"))
                let auto_react_guild
                try {
                    auto_react_guild = auto_react[message.guild.id].auto_react
                } catch {
                    auto_react_guild = "None"
                }

                let Embed = new MessageEmbed()
                    .setTitle("__SETTINGS INFO__")
                    .setColor("#CA0000")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTimestamp()
                    .addFields(
                        {name:"Prefix",value:`${prefix}`},
                        {name:"Join-message Status",value:`${join_message_status_guild}`},
                        {name:"Join-message Channel",value:`<#${join_message_channel_id_guild}>`},
                        {name:"Leave-message Status",value:`${leave_message_status_guild}`},
                        {name:"Leave-message Channel",value:`<#${leave_message_channel_id_guild}>`},
                        {name:"Auto-react",value:`${auto_react_guild}`},
                    )
                    message.channel.send(Embed)
            }
            // PREFIX
            if(args[0] == "prefix") {
                if(!args[1]) return CustomUserError("SpecifyPrefix", "s prefix <new-prefix>",  bot, message, __filename)
                let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"))
                prefixes[message.guild.id] = {
                    prefixes: args[1]
                }
                fs.writeFile("./DataBase/prefixes.json", JSON.stringify(prefixes), (err) => {
                    if (err) console.error();
                });
                let Embed = new MessageEmbed()
                    .setTitle(`${message_language[languages[message.guild.id]]["sPrefixUpdate"]}`)
                    .setColor("#FFCA2B")
                    .setDescription(`${message_language[languages[message.guild.id]]["sPrefixChanged"]} **${args[1]}** ${message_language[languages[message.guild.id]]["By"]} ${message.author}`)
                message.delete()
                message.channel.send(Embed)
            }
            // JOIN MESSAGE
            if(args[0] == "join-message") {
                if(!args[1] || args[1]=="help" || !"helponoffset-channel".includes(args[1])) {
                    let Embed = new MessageEmbed()
                    .setTitle("SETTINGS: JOIN-MESSAGE")
                    .setColor("#00C632")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTimestamp()
                    .addField(`${prefix}s join-message help`,`${message_language[languages[message.guild.id]]["sJoinMessageSyntaxHelp"]}`)
                    .addField(`${prefix}s join-message <on/off>`,`${message_language[languages[message.guild.id]]["sJoinMessageSyntaxOnOff"]}`)
                    .addField(`${prefix}s join-message set-channel <id>`,`${message_language[languages[message.guild.id]]["sJoinMessageSyntaxSetChannel"]}`)
                message.channel.send(Embed)
                }
                // SET-STATUS
                if(args[1] == "on" || args[1] == "off") {
                    let join_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/join-message-channel-id.json", "utf8"))
                    if(!join_message_channel_id[message.guild.id]) return CustomUserError("SpecifyChannelFirst", "s join-message set-channel <channel-id>", bot, message, __filename)

                    let join_message_status = JSON.parse(fs.readFileSync("./DataBase/join-message-status.json", "utf8"))
                    join_message_status[message.guild.id] = {
                        join_message_status: args[1]
                    }
                    fs.writeFile("./DataBase/join-message-status.json", JSON.stringify(join_message_status), (err) => {
                        if (err) console.error();
                    });
                    let Embed = new MessageEmbed()
                        .setTitle(`${message_language[languages[message.guild.id]]["sJoinMessageUpdate"]}`)
                        .setColor("#00C632")
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setTimestamp()
                        .setDescription(`${message_language[languages[message.guild.id]]["sJoinMessageChanged"]} **${args[1]}** ${message_language[languages[message.guild.id]]["By"]} ${message.author}`)
                    message.delete()
                    message.channel.send(Embed)
                    // relativeTimeRounding
                }
                // SET-CHANNEL
                if(args[1] == "set-channel") {
                    const args_join_message_channel = args[2]

                    let join_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/join-message-channel-id.json", "utf8"))
                    join_message_channel_id[message.guild.id] = {
                        join_message_channel_id: args_join_message_channel
                    }
                    fs.writeFile("./DataBase/join-message-channel-id.json", JSON.stringify(join_message_channel_id), (err) => {
                        if (err) console.error();
                    });

                    // console.log("ChannelID: "+args_join_message_channel)
                    let Embed = new MessageEmbed()
                    .setTitle(`${message_language[languages[message.guild.id]]["sJoinMessageUpdate"]}`)
                    .setColor("#00C632")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTimestamp()
                    .setDescription(`${message_language[languages[message.guild.id]]["sJoinMessageChannelChanged"]} <#${args_join_message_channel}> ${message_language[languages[message.guild.id]]["By"]} ${message.author}`)
                    message.delete()
                    message.channel.send(Embed)
                }} // Pour envoyer dans un salon spécifique : const Channel = bot.channels.cache.find(channel => channel.id === "(ID)")
            
            // LEAVE MESSAGE
            if(args[0] == "leave-message") {
                if(!args[1] || args[1]=="help" || !"helponoffset-channel".includes(args[1])) {
                    let Embed = new MessageEmbed()
                    .setTitle("SETTINGS: LEAVE-MESSAGE")
                    .setColor("#00C632")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTimestamp()
                    .addField(`${prefix}s leave-message help`,`${message_language[languages[message.guild.id]]["sLeaveMessageSyntaxHelp"]}`)
                    .addField(`${prefix}s leave-message <on/off>`,`${message_language[languages[message.guild.id]]["sLeaveMessageSyntaxOnOff"]}`)
                    .addField(`${prefix}s leave-message set-channel <id>`,`${message_language[languages[message.guild.id]]["sLeaveMessageSyntaxSetChannel"]}`)
                message.channel.send(Embed)
                }
                // SET-STATUS
                if(args[1] == "on" || args[1] == "off") {
                    let leave_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/leave-message-channel-id.json", "utf8"))
                    if(!leave_message_channel_id[message.guild.id]) return CustomUserError("SpecifyChannelFirst", "s leave-message set-channel <channel-id>", bot, message, __filename)

                    let leave_message_status = JSON.parse(fs.readFileSync("./DataBase/leave-message-status.json", "utf8"))
                    leave_message_status[message.guild.id] = {
                        leave_message_status: args[1]
                    }
                    fs.writeFile("./DataBase/leave-message-status.json", JSON.stringify(leave_message_status), (err) => {
                        if (err) console.error();
                    });
                    let Embed = new MessageEmbed()
                        .setTitle(`${message_language[languages[message.guild.id]]["sLeaveMessageUpdate"]}`)
                        .setColor("#00C632")
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setTimestamp()
                        .setDescription(`${message_language[languages[message.guild.id]]["sLeaveMessageChanged"]} **${args[1]}** ${message_language[languages[message.guild.id]]["By"]} ${message.author}`)
                    message.delete()
                    message.channel.send(Embed)
                }
                // SET-CHANNEL
                if(args[1] == "set-channel") {
                    const args_leave_message_channel = args[2]

                    let leave_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/leave-message-channel-id.json", "utf8"))
                    leave_message_channel_id[message.guild.id] = {
                        leave_message_channel_id: args_leave_message_channel
                    }
                    fs.writeFile("./DataBase/leave-message-channel-id.json", JSON.stringify(leave_message_channel_id), (err) => {
                        if (err) console.error();
                    });

                    // console.log("ChannelID: "+args_leave_message_channel)
                    let Embed = new MessageEmbed()
                    .setTitle(`${message_language[languages[message.guild.id]]["sLeaveMessageUpdate"]}`)
                    .setColor("#00C632")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTimestamp()
                    .setDescription(`${message_language[languages[message.guild.id]]["sLeaveMessageChannelChanged"]} <#${args_leave_message_channel}> ${message_language[languages[message.guild.id]]["By"]} ${message.author}`)
                    message.delete()
                    message.channel.send(Embed)
                }} // Pour envoyer dans un salon spécifique : const Channel = bot.channels.cache.find(channel => channel.id === "(ID)")
            
            // AUTO REACT
            if(args[0] == "auto-react") {
                if (args[1]!="on" && args[1]!="off") return UserError("SpecifyONOFF", bot, message, __filename)
                let auto_react = JSON.parse(fs.readFileSync("./DataBase/auto-react.json", "utf8"))

                auto_react[message.guild.id] = {
                    auto_react: args[1]
                }
                fs.writeFile("./DataBase/auto-react.json", JSON.stringify(auto_react), (err) => {
                    if (err) console.error();
                });
                let Embed = new MessageEmbed()
                .setTitle(`${message_language[languages[message.guild.id]]["sAutoReactUpdate"]}`)
                .setColor("#00C632")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setDescription(`${message_language[languages[message.guild.id]]["sAutoReactChanged"]} **${args[1]}** ${message_language[languages[message.guild.id]]["By"]} ${message.author}`)
                message.delete()
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