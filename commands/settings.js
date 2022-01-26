const { MessageEmbed } = require("discord.js")
const fs = require("fs");
const fetch = require('node-fetch');
// const { relativeTimeRounding } = require("moment");

module.exports = {
//    name: `${prefix}s`,
    name: "s",
    description: "Settings",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(!message.member.hasPermission("ADMINISTRATOR") && message.author.id != config["CreatorID"] && fs.readFileSync("./DataBase/admin", "utf8")=="off") return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Administrateur")
            let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
            const prefix = prefixes[message.guild.id].prefixes;
            // EMPTY ARG 0
            if(!args[0]){
                let Embed = new MessageEmbed()
                    .setTitle("__SETTINGS COMMANDS LIST__")
                    .setColor("#CA0000")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTimestamp()
                    .addField(`${prefix}s help`, "Affiche cette page")
                    .addField(`${prefix}s info`, "Donne la liste des paramètres et des valeurs")
                    .addField(`${prefix}s prefix <newprefix>`, "Change le préfix")
                    .addField(`${prefix}s join-message <action> <value>`, `Configure le join message\n*${prefix}s join-message help*`)
                    .addField(`${prefix}s leave-message <action> <value>`, `Configure le leave message\n*${prefix}s leave-message help*`)
                    .addField(`${prefix}s auto-react <on/off>`, "Permet au bot de réagir aux messages contenants des mots-clés")
                    message.channel.send(Embed)
                    return
            }
            // HELP
            if(args[0] == "help"){
                let Embed = new MessageEmbed()
                    .setTitle("__SETTINGS COMMANDS LIST__")
                    .setColor("#CA0000")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTimestamp()
                    .addField(`${prefix}s help`, "Affiche cette page")
                    .addField(`${prefix}s info`, "Donne la liste des paramètres et des valeurs")
                    .addField(`${prefix}s prefix <newprefix>`, "Change le préfix")
                    .addField(`${prefix}s join-message <action> <value>`, `Configure le join message\n*${prefix}s join-message help*`)
                    .addField(`${prefix}s leave-message <action> <value>`, `Configure le leave message\n*${prefix}s leave-message help*`)
                    .addField(`${prefix}s auto-react <on/off>`, "Permet au bot de réagir aux messages contenants des mots-clés")
                    message.channel.send(Embed)
                    return
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
                        {name:"Join-message Channel",value:`${join_message_channel_id_guild}`},
                        {name:"Leave-message Status",value:`${leave_message_status_guild}`},
                        {name:"Leave-message Channel",value:`${leave_message_channel_id_guild}`},
                        {name:"Auto-react",value:`${auto_react_guild}`},
                    )
                    message.channel.send(Embed)
                    return
            }
            // PREFIX
            if(args[0] == "prefix") {
                if(!args[1]) return message.lineReply(`Erreur: Veuillez préciser un préfix\n*${prefix}s prefix <new-prefix>*`)
                let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"))
                prefixes[message.guild.id] = {
                    prefixes: args[1]
                }
                fs.writeFile("./DataBase/prefixes.json", JSON.stringify(prefixes), (err) => {
                    if (err) console.error();
                });
                let Embed = new MessageEmbed()
                    .setTitle("PREFIX MIS A JOUR")
                    .setColor("#FFCA2B")
                    .setDescription(`Le préfix a été changé en **${args[1]}** par *${message.author.username}*`)
                message.delete()
                message.channel.send(Embed)
                return
            }
            // JOIN MESSAGE
            if(args[0] == "join-message") {
                if(!args[1] || args[1]=="help" || (args[1]!="on" && args[1]!="off" && args[1]!="set-channel")) {
                    let Embed = new MessageEmbed()
                    .setTitle("SETTINGS: JOIN-MESSAGE")
                    .setColor("#00C632")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTimestamp()
                    .addField(`${prefix}s join-message help`,`\nAffiche cette page`)
                    .addField(`${prefix}s join-message <on/off>`,`\nActive/désactive le join message`)
                    .addField(`${prefix}s join-message set-channel <id>`,`\nParamètre le salon où le join message va être envoyé`)
                message.channel.send(Embed)
                return
                }
                // SET-STATUS
                if(args[1] == "on" || args[1] == "off") {
                    let join_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/join-message-channel-id.json", "utf8"))
                    if(!join_message_channel_id[message.guild.id]) return message.lineReply(`Erreur: Vous devez d'abord définir le salon\n*${prefix}s join-message set-channel <channel-id>*`)

                    let join_message_status = JSON.parse(fs.readFileSync("./DataBase/join-message-status.json", "utf8"))
                    join_message_status[message.guild.id] = {
                        join_message_status: args[1]
                    }
                    fs.writeFile("./DataBase/join-message-status.json", JSON.stringify(join_message_status), (err) => {
                        if (err) console.error();
                    });
                    let Embed = new MessageEmbed()
                        .setTitle("JOIN-MESSAGE MIS A JOUR")
                        .setColor("#00C632")
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setTimestamp()
                        .setDescription(`Le join message a été mis sur **${args[1]}** par *${message.author}*`)
                    message.delete()
                    message.channel.send(Embed)
                    // relativeTimeRounding
                    return
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
                    .setTitle("JOIN-MESSAGE MIS A JOUR")
                    .setColor("#00C632")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTimestamp()
                    .setDescription(`Le salon du join message a été changé sur <#${args_join_message_channel}> par *${message.author}*`)
                    message.delete()
                    message.channel.send(Embed)
                    return
                }} // Pour envoyer dans un salon spécifique : const Channel = bot.channels.cache.find(channel => channel.id === "(ID)")
            
            // LEAVE MESSAGE
            if(args[0] == "leave-message") {
                if(!args[1] || args[1]=="help" || (args[1]!="on" && args[1]!="off" && args[1]!="set-channel")) {
                    let Embed = new MessageEmbed()
                    .setTitle("SETTINGS: LEAVE-MESSAGE")
                    .setColor("#00C632")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTimestamp()
                    .addField(`${prefix}s leave-message help`,`\nAffiche cette page`)
                    .addField(`${prefix}s leave-message <on/off>`,`\nActive/désactive le leave message`)
                    .addField(`${prefix}s leave-message set-channel <id>`,`\nParamètre le salon où le leave message va être envoyé`)
                message.channel.send(Embed)
                return
                }
                // SET-STATUS
                if(args[1] == "on" || args[1] == "off") {
                    let leave_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/leave-message-channel-id.json", "utf8"))
                    if(!leave_message_channel_id[message.guild.id]) return message.lineReply(`Erreur: Vous devez d'abord définir le salon\n*${prefix}s leave-message set-channel <channel-id>*`)

                    let leave_message_status = JSON.parse(fs.readFileSync("./DataBase/leave-message-status.json", "utf8"))
                    leave_message_status[message.guild.id] = {
                        leave_message_status: args[1]
                    }
                    fs.writeFile("./DataBase/leave-message-status.json", JSON.stringify(leave_message_status), (err) => {
                        if (err) console.error();
                    });
                    let Embed = new MessageEmbed()
                        .setTitle("LEAVE-MESSAGE MIS A JOUR")
                        .setColor("#00C632")
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setTimestamp()
                        .setDescription(`Le leave message a été mis sur **${args[1]}** par *${message.author}*`)
                    message.delete()
                    message.channel.send(Embed)
                    // relativeTimeRounding
                    return
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
                    .setTitle("LEAVE-MESSAGE MIS A JOUR")
                    .setColor("#00C632")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setTimestamp()
                    .setDescription(`Le salon du leave message a été changé sur <#${args_leave_message_channel}> par *${message.author}*`)
                    message.delete()
                    message.channel.send(Embed)
                    return
                }} // Pour envoyer dans un salon spécifique : const Channel = bot.channels.cache.find(channel => channel.id === "(ID)")
            
            // AUTO REACT
            if(args[0] == "auto-react") {
                if (args[1]!="on" && args[1]!="off") return message.lineReply("Erreur: Vous devez définir ceci sur on/off");
                let auto_react = JSON.parse(fs.readFileSync("./DataBase/auto-react.json", "utf8"))

                auto_react[message.guild.id] = {
                    auto_react: args[1]
                }
                fs.writeFile("./DataBase/auto-react.json", JSON.stringify(auto_react), (err) => {
                    if (err) console.error();
                });
                let Embed = new MessageEmbed()
                .setTitle("AUTO-REACT MIS A JOUR")
                .setColor("#00C632")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                .setDescription(`L'Auto-React a été mis sur **${args[1]}** par *${message.author}*`)
                message.delete()
                message.channel.send(Embed)
                return
            }
            // UNKNOW ARG 0
            message.lineReply(`Erreur: Argument inconnu : ${args[0]}\n*${prefix}s help*`)
        } catch (error) { // ERROR PREVENTER
            console.error(`${error}`)
            message.lineReply(`Une erreur est survenue`)
            var URL = fs.readFileSync("./DataBase/webhook-logs-url", "utf8")
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