const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch');

module.exports = {
    name: 'warns',
    description: "Permet de voir les informations des avertissements d'un utilisateur",
    usage: "warns help",
    category: "Moderation",
    execute(message, args) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(!(message.member.hasPermission("KICK_MEMBERS") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Kick des Membres)")
            
            let warns = JSON.parse(fs.readFileSync("./DataBase/warns.json", "utf8"));

            if(!args[0] || args[0] == "help") {
                let EmbedHelp = new MessageEmbed()
                .setTitle(`WARNS CLEAR-ALL`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("ORANGE")
                .addField(`${prefix}warns help`, `Affiche cette page`)
                .addField(`${prefix}warns <user>`, `Affiche les warns d'un utilisateur`)
                .addField(`${prefix}warns <user> add`, `Ajoute des warns à un utilisateur`)
                .addField(`${prefix}warns <user> remove`, `Retire des warns à un utilisateur`)
                .addField(`${prefix}warns <user> clear`, `Supprime les warns d'un utilisateur`)
                .addField(`${prefix}warns clear-all`, `Supprime tous les warns`)
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
                .setDescription(`Tous les warns ont été **supprimés** par ${message.author}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("ORANGE")
                .setTimestamp()
                message.channel.send(EmbedClearAll)
                return
            }
            
            let User = message.mentions.users.first()||null

            if(!User) return message.lineReply(`Erreur: Veuillez préciser un utilisateur valide\n*${prefix}warns help*`)

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
                .setDescription(`${User} a actuellement **${warns[message.guild.id][User.id].warns} warns**`)
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
                .setDescription(`Tous les warns de ${User} ont été **supprimés** par ${message.author}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("ORANGE")
                .setTimestamp()
                message.channel.send(EmbedClear)
                return
            }
            if(args[1] == "remove") {
                message.delete()
                if(!args[2]) return message.lineReply("Erreur: Veuillez préciser un nombre\n*${prefix}warns help*")
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
                .setDescription(`Les warns de ${User} ont été mis à jour de **${oldwarns}** à **${warns[message.guild.id][User.id].warns}**`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("ORANGE")
                .setTimestamp()
                message.channel.send(EmbedRemove)
            }
            if(args[1] == "add") {
                message.delete()
                if(!args[2]) return message.lineReply("Erreur: Veuillez préciser un nombre\n*${prefix}warns help*")
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
                .setDescription(`Les warns de ${User} ont été mis à jour de **${oldwarns}** à **${warns[message.guild.id][User.id].warns}**`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("ORANGE")
                .setTimestamp()
                message.channel.send(EmbedAdd)
            }
        } catch (error) { // ERROR PREVENTER
            console.error(`${error}`)
            message.lineReply(`Une erreur est survenue`)
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