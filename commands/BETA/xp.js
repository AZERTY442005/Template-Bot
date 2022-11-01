const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch');
const {format: prettyFormat} = require('pretty-format');
const UserError = require("../../Functions/UserError.js")
const Error = require("../../Functions/Error.js")
const UserErrorNoPermissions = require("../../Functions/UserErrorNoPermissions.js")

module.exports = {
    name: 'xp',
    description: "Gère le Système d'XP du serveur",
    aliases: [],
    usage: "xp help",
    category: "Utility",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
            const prefix = prefixes[message.guild.id].prefixes;

            var times = 10;
            let temp = 10
            let levels_requirments = []
            for(var i = 0; i < times; i++){ // GET LEVELS REQUIRMENTS
                levels_requirments.push(Math.floor(temp))
                temp = temp * 1.5
            }

            let xp_system = JSON.parse(fs.readFileSync("./DataBase/xp-system.json", "utf8"))
            if(!xp_system["status"]) xp_system["status"] = {}
            if(!xp_system["status"][message.guild.id]) {
                xp_system["status"][message.guild.id] = "on"
                fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system, null, 4), (err) => {
                    if (err) console.error();
                });
            }
            if(!xp_system["messages"]) xp_system["messages"] = {}
            if(!xp_system["messages"][message.guild.id]) xp_system["messages"][message.guild.id] = {}
            if(!xp_system["messages"][message.guild.id][message.author.id]) {
                xp_system["messages"][message.guild.id][message.author.id] = 0
                fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system, null, 4), (err) => {
                    if (err) console.error();
                });
            }
            if(!xp_system["levels"]) xp_system["levels"] = {}
            if(!xp_system["levels"][message.guild.id]) xp_system["levels"][message.guild.id] = {}
            if(!xp_system["levels"][message.guild.id][message.author.id]) {
                xp_system["levels"][message.guild.id][message.author.id] = 0
                fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system, null, 4), (err) => {
                    if (err) console.error();
                });
            }
            if(!xp_system["total-messages"]) xp_system["total-messages"] = {}
            if(!xp_system["total-messages"][message.guild.id]) xp_system["total-messages"][message.guild.id] = {}
            if(!xp_system["total-messages"][message.guild.id][message.author.id]) {
                xp_system["total-messages"][message.guild.id][message.author.id] = 0
                fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system, null, 4), (err) => {
                    if (err) console.error();
                });
            }

            if(!args[0]) { // SEE OWN XP
                if(xp_system["status"][message.guild.id]=="off") return Error("Le système d'XP est désactivé sur ce serveur", bot, message, __filename)
                let EmbedXP = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("AQUA")
                .setThumbnail(message.author.displayAvatarURL())
                // .addField(`LEVEL: ${xp_system["levels"][message.guild.id][message.author.id]}`, `MESSAGES: ${xp_system["messages"][message.guild.id][message.author.id]}/${levels_requirments[xp_system["levels"][message.guild.id][message.author.id]]}`)
                .addField(`LEVEL: ${xp_system["levels"][message.guild.id][message.author.id]}`, `MESSAGES: ${xp_system["levels"][message.guild.id][message.author.id]!=10 ? `${xp_system["messages"][message.guild.id][message.author.id]+"/"+levels_requirments[xp_system["levels"][message.guild.id][message.author.id]]}` : "**MAX**"}`)
                .setTimestamp()
                message.channel.send(EmbedXP)
                return
            }
            let usermention = message.mentions.users.first();
            if(usermention && !args[1]) { // SEE OTHERS XP
                if(xp_system["status"][message.guild.id]=="off") return Error("Le système d'XP est désactivé sur ce serveur", bot, message, __filename)
                if(!xp_system["messages"][message.guild.id][usermention.id]) {
                    xp_system["messages"][message.guild.id][usermention.id] = 0
                    fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system, null, 4), (err) => {
                        if (err) console.error();
                    });
                }
                if(!xp_system["levels"][message.guild.id][usermention.id]) {
                    xp_system["levels"][message.guild.id][usermention.id] = 0
                    fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system, null, 4), (err) => {
                        if (err) console.error();
                    });
                }
                let EmbedXP = new MessageEmbed()
                .setAuthor(usermention.tag, usermention.displayAvatarURL())
                .setColor("AQUA")
                .setThumbnail(usermention.displayAvatarURL())
                // .addField(`LEVEL: ${xp_system["levels"][message.guild.id][usermention.id]}`, `MESSAGES: ${xp_system["messages"][message.guild.id][usermention.id]}/${levels_requirments[xp_system["levels"][message.guild.id][usermention.id]]}`)
                .addField(`LEVEL: ${xp_system["levels"][message.guild.id][usermention.id]}`, `MESSAGES: ${xp_system["levels"][message.guild.id][usermention.id]!=10 ? `${xp_system["messages"][message.guild.id][usermention.id]+"/"+levels_requirments[xp_system["levels"][message.guild.id][usermention.id]]}` : "**MAX**"}`)
                .setTimestamp()
                message.channel.send(EmbedXP)
                return
            }
            if(args[0] == "help" || !"onoffsetreset-all".includes(args[0])) { // HELP PAGE
                let EmbedHelp = new MessageEmbed()
                .setTitle(`XP COMMANDS`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("AQUA")
                .addField(`${prefix}xp (<user>)`, "Permet de voir l'XP d'un utilisateur")
                .addField(`${prefix}xp <on/off>`, "Active/Désactive le système d'XP")
                .addField(`${prefix}xp set <user> <add/remove> <number>`, "Modifie l'XP d'un utilisateur")
                .addField(`${prefix}xp reset <user>`, "Réinitialise l'XP d'un utilisateur")
                .addField(`${prefix}xp reset-all`, "Réinitialise l'XP de tous les utilisateurs")
                .setTimestamp()
                message.channel.send(EmbedHelp)
                return
            }
            if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("Administrateur", bot, message, __filename)
            if(args[0] == "on" || args[0] == "off") { // CHANGE XP STATE
                if(xp_system["status"][message.guild.id]==args[0]) return Error(`Le système d'XP est déjà sur ${args[0].toUpperCase()}`, bot, message, __filename)
                xp_system["status"][message.guild.id] = args[0]
                fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system, null, 4), (err) => {
                    if (err) console.error();
                });
                let EmbedStatus = new MessageEmbed()
                .setTitle(`XP SYSTEM`)
                .setDescription(`Le système d'XP a été changé sur **${args[0]}**`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("AQUA")
                .setTimestamp()
                message.delete()
                message.channel.send(EmbedStatus)
            }
            if(args[0] == "reset-all") { // RESET ALL XPS
                // return message.lineReply(`Commande en développement`) // TEMP ERROR
                xp_system["messages"][message.guild.id] = {}
                xp_system["levels"][message.guild.id] = {}
                // xp_system["total-messages"][message.guild.id] = {}
                fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system, null, 4), (err) => {
                    if (err) console.error();
                });
                // console.log(JSON.stringify(xp_system, null, 4))
                // console.log(prettyFormat(xp_system))
                let EmbedResetAll = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("AQUA")
                .addField("XP SYSTEM RESET-ALL", `Toute l'XP du serveur a été réinitialisé par ${message.author}`)
                .setTimestamp()
                message.channel.send(EmbedResetAll)
                return
            }
            if(args[0] == "set") { // CHANGE XP OF A USER
                if(!usermention) return UserError("Veuillez préciser un utilisateur", bot, message, __filename)
                if(args[2] == "level") {
                    if(!args[3]) return UserError("Veuillez préciser un nombre", bot, message, __filename)
                    const usermention = message.mentions.users.first();
                    xp_system["levels"][message.guild.id][usermention.id] = parseInt(args[3])
                    fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system, null, 4), (err) => {
                        if (err) console.error();
                    });
                    return
                }
                if(args[2] == "messages") {
                    if(!args[3]) return UserError("Veuillez préciser un nombre", bot, message, __filename)
                    const usermention = message.mentions.users.first();
                    xp_system["messages"][message.guild.id][usermention.id] = parseInt(args[3])
                    fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system, null, 4), (err) => {
                        if (err) console.error();
                    });
                    return
                }
                UserError("Veuillez préciser une variable", bot, message, __filename)
            }
            if(args[0] == "reset") { // RESET XP OF A USER
                if(!usermention) return UserError("Veuillez préciser un utilisateur", bot, message, __filename)
                xp_system["messages"][message.guild.id][usermention.id] = 0
                xp_system["levels"][message.guild.id][usermention.id] = 0
                fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system, null, 4), (err) => {
                    if (err) console.error();
                });
                let EmbedReset = new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("AQUA")
                .setThumbnail(usermention.displayAvatarURL())
                .addField("XP SYSTEM RESET", `L'XP de ${usermention} a été réinitialisé par ${message.author}`)
                .setTimestamp()
                message.channel.send(EmbedReset)
            }
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