const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const fetch = require('node-fetch');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const Error = require("../Functions/Error.js")
const UserError = require("../Functions/UserError.js")
const Success = require("../Functions/Success.js");

module.exports = {
    name: 'rules',
    description: "Créer un règlement sur le serveur",
    aliases: [],
    usage: "rules help",
    category: "Utility",
    execute(message, args, bot) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            let rules = JSON.parse(fs.readFileSync("./DataBase/rules.json", "utf8"));
            const usermention = message.mentions.users.first()
            if(args[0] && !"helpsetsendelete".includes(args[0]) && !usermention || args[0]=="help") { // HELP PAGE
                let EmbedHelp = new MessageEmbed()
                .setTitle(`RULES COMMANDS`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("GREEN")
                .addField(`${prefix}rules (<user>)`, "Envoie le règlement du serveur par message privé")
                .addField(`${prefix}rules send`, "Envoie le règlement du serveur dans le salon actuel")
                .addField(`${prefix}rules set`, "Défini le règlement")
                .addField(`${prefix}rules delete`, "Supprime le règlement actuel")
                .setTimestamp()
                message.channel.send(EmbedHelp)
                return
            }
            if(!args[0] || (usermention && !args[1])) { // SEND RULES MP
                if(!rules[message.guild.id]) return Error("Le règlement est vide", bot, message, __filename)
                let EmbedSend = new MessageEmbed()
                .setTitle(`Règlement`)
                .setDescription(`${rules[message.guild.id]}`)
                .setColor("GREEN")
                .setFooter(`${config["BotInfo"]["name"]}`, `${config["BotInfo"]["IconURL"]}`)
                .setTimestamp()

                if (!args[0]) {
                    message.author.send(EmbedSend)
                    // message.lineReply("Le règlement vous a été envoyé en messages privés") // SUCCESS
                    Success("Le règlement vous a été envoyé en messages privés", bot, message, __filename)
                } else {
                    if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("Administrateur", bot, message, __filename)
                    usermention.send(EmbedSend)
                    message.delete()
                }
                return
            }
            if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("Administrateur", bot, message, __filename)
            // if(args[0]=="add") { // ADD RULE
            //     let title = args[1]
            //     let description = args.slice(2).join(" ");

            //     rules[message.guild.id]["titles"].push(title)
            //     rules[message.guild.id]["descriptions"].push(description)
            //     fs.writeFile("./DataBase/rules.json", JSON.stringify(rules), (err) => {
            //         if (err) console.error();
            //     });

            //     let EmbedAdd = new MessageEmbed()
            //     .setTitle(`RULES MODIFICATION`)
            //     .setColor("GREEN")
            //     .setAuthor(message.author.tag, message.author.displayAvatarURL())
            //     .addField(`Une nouvelle règle a été ajoutée` ,`__${title}:__ ${description}`)
            //     .setTimestamp()
            //     message.channel.send(EmbedAdd)
            // }
            // if(args[0]=="remove") { // REMOVE RULE
            //     let id = parseInt(args[1])
            //     if(!id) return message.lineReply(`Erreur: Veuillez préciser l'ID d'une règle\n*${prefix}rules remove <id>*`)

            //     if(!rules[message.guild.id]["titles"][id]) return message.lineReply(`Erreur: Veuillez préciser un ID de règle valide`)
            //     const oldtitle = rules[message.guild.id]["titles"][id]
            //     const olddescription = rules[message.guild.id]["descriptions"][id]
            //     delete rules[message.guild.id]["titles"][id]
            //     delete rules[message.guild.id]["descriptions"][id]
            //     fs.writeFile("./DataBase/rules.json", JSON.stringify({}), (err) => {
            //         if (err) console.error();
            //     });
            //     fs.writeFile("./DataBase/rules.json", JSON.stringify(rules), (err) => {
            //         if (err) console.error();
            //     });

            //     let EmbedAdd = new MessageEmbed()
            //     .setTitle(`RULES MODIFICATION`)
            //     .setColor("GREEN")
            //     .setAuthor(message.author.tag, message.author.displayAvatarURL())
            //     .addField(`Une règle a été supprimée` ,`__${oldtitle}:__ ${olddescription}`)
            //     .setTimestamp()
            //     message.channel.send(EmbedAdd)
            // }
            if(args[0]=="set") { // SET RULES
                if(!args[1]) return UserError("Veuillez préciser un règlement", bot, message, __filename)
                newrules = args.slice(1).join(" ");
                rules[message.guild.id] = newrules
                fs.writeFile("./DataBase/rules.json", JSON.stringify(rules), (err) => {
                    if (err) console.error();
                });

                let EmbedSet = new MessageEmbed()
                .setTitle(`RULES UPDATE`)
                .setDescription(`__**Le règlement a été mis à jour**__\n\n${newrules}`)
                .setColor("GREEN")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                message.delete()
                message.channel.send(EmbedSet)
            }
            if(args[0]=="send") { // SEND RULES CHANNEL
                if(!rules[message.guild.id]) return Error("Le règlement est vide", bot, message, __filename)
                let EmbedSend = new MessageEmbed()
                .setTitle(`Règlement`)
                .setDescription(`${rules[message.guild.id]}`)
                .setColor("GREEN")
                .setFooter(`${config["BotInfo"]["name"]}`, `${config["BotInfo"]["IconURL"]}`)
                .setTimestamp()
                message.delete()
                message.channel.send(EmbedSend)
            }
            if(args[0]=="delete") { // DELETE RULES
                if(!rules[message.guild.id]) return Error("Le règlement est vide", bot, message, __filename)
                let EmbedDelete = new MessageEmbed()
                .setTitle(`RULES DELETED`)
                .setDescription(`Le règlement du serveur a été supprimé`)
                .setColor("GREEN")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setTimestamp()
                message.delete()
                message.channel.send(EmbedDelete)

                delete rules[message.guild.id]
                fs.writeFile("./DataBase/rules.json", JSON.stringify(rules), (err) => {
                    if (err) console.error();
                });
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