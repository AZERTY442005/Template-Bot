const { MessageEmbed } = require("discord.js");
const fs = require("fs")

module.exports = {
    name: 'owner',
    description: "Contrôle total du bot",
    execute(message, args, bot) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(message.author.id != config["OwnerID"] && message.author.id != config["CreatorID"]) return message.lineReply(`Erreur: Vous n'êtes pas le propriétaire du bot`)
        if(!args[0] || args[0]=="help" || !"helpshutdowndisablenablestatusinfoguildslogsbetadminhostdm".includes(args[0])) {
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
            // console.log(fs.readFileSync("./DataBase/status", "utf8"))
            if(args[0]=="enable") {
                fs.writeFile("./DataBase/status", "on", (err) => {
                    if (err) console.error();
                })
                message.lineReply(`${config["BotInfo"]["name"]} activé`)
            }
            if(args[0]=="disable") {
                fs.writeFile("./DataBase/status", "off", (err) => {
                    if (err) console.error();
                })
                message.lineReply(`${config["BotInfo"]["name"]} désactivé`)
            }
            
        }
        if(args[0]=="status") {
            const status = args.slice(1).join(" ");
            bot.user.setActivity(status);
            // bot.user.setPresence({
            //     status: 'dnd',
            //     activity: {
            //         name: status
                    // type: 'TYPE',
                    // url: 'LIEN'
            //     }
            // });
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


            fs.writeFile("./DataBase/webhook-logs-url", args[1], (err) => {
                if (err) console.error();
            })
            message.lineReply(`Modification du Webhook des logs effectuée !!!`)
        }
        if(args[0]=="beta") {
            if(!args[1]=="on" && !args[1]=="off") return message.lineReply(`Erreur: Veuillez préciser **on** ou **off**\n*${prefix}owner beta <on/off>*`)


            fs.writeFile("./DataBase/beta", args[1], (err) => {
                if (err) console.error();
            })
            message.lineReply(`Version BETA modifiée avec succès !!! (redémarrage nécessaire)`)
        }
        if(args[0]=="admin") {
            if(!args[1]=="on" && !args[1]=="off") return message.lineReply(`Erreur: Veuillez préciser **on** ou **off**\n*${prefix}owner admin <on/off>*`)


            fs.writeFile("./DataBase/admin", args[1], (err) => {
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
            .catch(error => {
                message.author.send(`Impossible d'envoyer un Message Privé à ${dmUser}`)
            })
            message.delete()
        }
    }
}