const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const fetch = require('node-fetch');

module.exports = {
    name: 'owner',
    description: "Contrôle total du bot",
    execute(message, args, bot) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(message.author.id != config["OwnerID"] && message.author.id != config["CreatorID"]) return message.lineReply(`Erreur: Vous n'êtes pas le propriétaire du bot`)
            if(!args[0] || args[0]=="help" || !"helpshutdowndisablenablestatusinfoguildslogsbetadminhostdmdatabase".includes(args[0])) {
                let EmbedHelp = new MessageEmbed()
                .setTitle(`OWNER COMMANDS`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("RED")
                .addField(`${prefix}owner shutdown`, `Arrête l'exécution du bot`)
                .addField(`${prefix}owner <enable/disable>`, `Active/Désactive le bot`)
                .addField(`${prefix}owner status <on/off>`, `Change le status du bot`)
                .addField(`${prefix}owner logs <webhook-url>`, `Envoie les logs du Bot sur un webhook`)
                .addField(`${prefix}owner beta <on/off>`, `Active/Désactive la Version BETA`)
                .addField(`${prefix}owner admin <on/off>`, `Active/Désactive les permissions d'admin du bot sur un serveur`)
                .addField(`${prefix}owner host`, `Envoie le lien du dashboard de l'hébergeur`)
                .addField(`${prefix}owner dm`, `Envoie un message privé à un utilisateur`)
                .addField(`${prefix}owner database`, `Envoie en message privé la Base de Données`)
                .setTimestamp()
                message.channel.send(EmbedHelp)
            }
            if(args[0]=="shutdown") {
                try{
                    message.lineReply("Tentative d'arrêt du bot...")
                    console.log(`${config["BotInfo"]["name"]} stopped by ${message.author.username}`)
                    process.exit()
                } catch {
                    message.lineReply("Erreur lors de l'arrêt du bot")
                }
            }
            if(args[0]=="enable" || args[0]=="disable") {
                // ENABLE/DISABLE
                // console.log(fs.readFileSync("./DataBase/status.txt", "utf8"))
                if(args[0]=="enable") {
                    fs.writeFile("./DataBase/status.txt", "on", (err) => {
                        if (err) console.error();
                    })
                    message.lineReply(`${config["BotInfo"]["name"]} activé`)
                }
                if(args[0]=="disable") {
                    fs.writeFile("./DataBase/status.txt", "off", (err) => {
                        if (err) console.error();
                    })
                    message.lineReply(`${config["BotInfo"]["name"]} désactivé`)
                }
                
            }
            if(args[0]=="status") {
                const status = args.slice(1).join(" ");
                // bot.user.setActivity(status);
                bot.setActivity(status);
                // bot.user.setPresence({
                //     status: 'dnd',
                //     activity: {
                //         name: status
                        // type: 'TYPE',
                        // url: 'LIEN'
                //     }
                // });

                // bot.user.setPresence({ activities: [{ name: 'activity' }], status: 'idle' });
            }
            if(args[0]=="info") {
                // const Guilds = bot.guilds.cache.map(guild => guild.name);
                // message.channel.send(`Connected on ${Guilds.length} servers`)
                // console.log(GuildsList.length)
            }
            if(args[0]=="guilds") {
                // const Guilds = bot.guilds.cache.map(guild => guild.name);
                // message.channel.send(`Connected on ${Guilds.length} servers`)
                // console.log(GuildsList.length)
            }
            if(args[0]=="logs") {
                if(!args[1]) return message.lineReply(`Erreur: Veuillez préciser le lien du Webhook\n*${prefix}owner logs <webhook-url>*`)
                if(!args[1].includes("https://discord.com/api/webhooks/")) return message.lineReply(`Erreur: Veuillez préciser un lien Webhook valide`)


                fs.writeFile("./DataBase/webhook-logs-url.txt", args[1], (err) => {
                    if (err) console.error();
                })
                message.lineReply(`Modification du Webhook des logs effectuée !!!`)
            }
            if(args[0]=="beta") {
                if(!args[1]=="on" && !args[1]=="off") return message.lineReply(`Erreur: Veuillez préciser **on** ou **off**\n*${prefix}owner beta <on/off>*`)


                fs.writeFile("./DataBase/beta.txt", args[1], (err) => {
                    if (err) console.error();
                })
                message.lineReply(`Version BETA modifiée avec succès !!! (redémarrage nécessaire)`)
            }
            if(args[0]=="admin") {
                if(!args[1]=="on" && !args[1]=="off") return message.lineReply(`Erreur: Veuillez préciser **on** ou **off**\n*${prefix}owner admin <on/off>*`)


                fs.writeFile("./DataBase/admin.txt", args[1], (err) => {
                    if (err) console.error();
                })
                message.lineReply(`Admin Perms modifiées avec succès !!!`)
            }
            if(args[0]=="host") {
                message.lineReply(config["host"])
            }
            if(args[0]=="dm") {
                let dmUser = message.mentions.users.first();
                if(!args[1]) return message.lineReply(`Erreur: Veuillez préciser un utilisateur`)
                if(!dmUser) return message.channel.send(`Erreur: Veuillez préciser un utilisateur valide`)
                //if(dmUser.id == `782885398316711966`) return message.channel.send(`ERREUR: Veuillez préciser un utilisateur valide (pas moi de préférence)`)
                if(!args[2]) return message.lineReply(`Erreur: Veuillez préciser un message`)
                const dmMessage = args.slice(2).join(` `);
                dmUser.send(dmMessage)
                .then(res => {
                    message.author.send(`Message envoyé à ${dmUser} avec succès`)
                })
                .catch(error => {
                    message.author.send(`Impossible d'envoyer un Message Privé à ${dmUser}`)
                })
                message.delete()
            }
            if(args[0] == "database") {
                let SendFiles = new Array()
                let FilesList = new Array()
                const DataBase = fs.readdirSync('./DataBase')
                for (const file of DataBase) {
                    SendFiles.push(`./DataBase/${file}`)
                    FilesList.push(`${file}`)
                }
                // console.log(prettyFormat(SendFiles))
                // console.log(prettyFormat(SendFiles.slice(1, 5)))
                // console.log(Math.floor(SendFiles.length/10+1))

                // message.channel.send("Testing message.", {
                    // files: [
                    //     "./DataBase/admin",
                    //     "./DataBase/auto-react.json",
                    //     "./DataBase/beta",
                    //     "./DataBase/blacklist.json",
                    //     "./DataBase/DATAS.json",
                    //     "./DataBase/join-message-channel-id.json",
                    //     "./DataBase/join-message-status.json",
                    //     "./DataBase/leave-message-channel-id.json",
                    //     "./DataBase/leave-message-status.json",
                    //     "./DataBase/logs.json",
                    //     "./DataBase/prefixes.json",
                    //     "./DataBase/rules.json",
                    //     "./DataBase/status",
                    //     "./DataBase/warns.json",
                    //     "./DataBase/webhook-logs-url",
                    //     "./DataBase/xp-system.json",
                    // ]
                //     files: SendFiles
                //   });

                const SendFiles_chunks = SendFiles.map((e, i) => { 
                    return i % 10 === 0 ? SendFiles.slice(i, i + 10) : null; 
                }).filter(e => { return e; });

                const Embed = new MessageEmbed()
                .setTitle("DataBase")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("GOLD")
                .addField(`Files`, `${FilesList.join(", ")}`)
                .setTimestamp()
                message.author.send(Embed)

                // for(const i=0;i<Math.floor(SendFiles.length/10+1);i++) {
                for(const Files in SendFiles_chunks) {
                    message.author.send({
                        files: SendFiles_chunks[Files]
                    })
                }
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