const { MessageEmbed } = require("discord.js");
const fs = require('fs')

module.exports = {
    name: 'help',
    description: "Permet d'afficher cette page",
    execute(message,) {
        // console.log("/help")
        //            message.reply(`\n **${prefix}help:** Permet d'afficher cette page \n **${prefix}ping:** Me fait écrire pong \n **${prefix}stats:** Permet de voir les stats du server **${prefix}roll:** Choisit un nombre aléatoire entre 1 et 6 \n **${prefix}kick:** Kick un utilisateur \n **${prefix}ban:** Ban un utilisateur \n **${prefix}hey:** Je te dis hey \n **${prefix}me:** Je te dis qui tu es \n **${prefix}say:** Me fais parler`);            
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            let EmbedHelp1 = new MessageEmbed()
                .setTitle("__Page d'aide__")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setDescription(`__Préfix: ${prefix}__\n<argument> Argument obligatoire\n(<argument>) Argument facultatif\n[<argument>] Argument nécessaire aux facultatifs`)
                .setColor("GOLD")
            // .addField(`${prefix}help`,"Permet d'afficher cette page")
            // .addField(`${prefix}ping`,"Me fait écrire pong")
            // .addField(`${prefix}roll`,"Choisi un nombre aléatoire entre 1 et 6")
            // .addField(`${prefix}kick <user> (<reason>)`,"Kick un utilisateur")
            // .addField(`${prefix}ban <user> (<reason>)`,"Banni un utilisateur")
            // .addField(`${prefix}unban <user> (<reason>)`,"Débanni un utilisateur")
            // .addField(`${prefix}hey`,"Je te dis hey")
            // .addField(`${prefix}say <msg>`,"Me fais parler")
            // .addField(`${prefix}userinfo <user>`,"Affiche les infos d'un utilisateur")
            // .addField(`${prefix}serverinfo`,"Affiche les infos du serveur")
            // .addField(`${prefix}ghostping <mention>`,"Mentionne discrètement")
            // .addField(`${prefix}embed (<titre>) <message>`,"Affiche un message embed")
            // .addField(`${prefix}avatar (<user>)`,"Montre l'avatar d'un utilisateur")
            // .addField(`${prefix}clear <nb>`,"Supprime des messages")
            // .addField(`${prefix}report <user> <reason>`,"Report un utilisateur")
            // .addField(`${prefix}warn <user> <reason>`,"Warn un utilisateur")
            // .addField(`${prefix}warns <user> (<action(clear-all/clear/add/remove)>) [<number>]`,"Affiche les informations des avertissements d'un utilisateur")
            // .addField(`${prefix}bruh`,"Envoie un GIF aléatoire de bruh")
            // .addField(`${prefix}8ball <wish>`,"Magic 8ball")
            // .addField(`${prefix}love`,"Choisi 2 personnes à unire")
            // .addField(`${prefix}announce <msg>`,"Envoie un message embed pour annoncer")
            // .addField(`${prefix}slowmode <time>`,"Change le Slowmode du salon actuel")
            // .addField(`${prefix}dm <user> <msg>`,"Envoie un DM à un utilisateur")
            // .addField(`${prefix}s <action> <value>`,"Menu des paramètres")
            // .addField(`${prefix}prefix`,"Affiche le préfix")
            // .addField(`${prefix}invite`,"Envoie mon lien d'invitation")
            // .addField(`${prefix}credits`,"Affiche mes credits")

                .addField("__**Par défaut**__", "Commandes de base ou nécessaires")
                .addFields(
                    {name:`${prefix}help`,value:"Permet d'afficher cette page", inline:true},
                    {name:`${prefix}ping`,value:"Permet d'afficher cette page", inline:true},
                    {name:`${prefix}hey`,value:"Je te dis hey", inline:true},
                    {name:`${prefix}s <action> <value>`,value:"Menu des paramètres", inline:true},
                    {name:`${prefix}credits`,value:"Affiche mes credits", inline:true},
                    {name:`${prefix}invite`,value:"Envoie mon lien d'invitation", inline:true},
                )
                .addField("__**Modération**__", "Commandes de contrôle")
                .addFields(
                    {name:`${prefix}ban <user> (<reason>)`,value:"Ban un utilisateur", inline:true},
                    {name:`${prefix}unban <user> (<reason>)`,value:"Débanni un utilisateur", inline:true},
                    {name:`${prefix}kick <user> (<reason>)`,value:"Kick un utilisateur", inline:true},
                    {name:`${prefix}report <user> <reason>`,value:"Report un utilisateur", inline:true},
                    {name:`${prefix}clear <nb>`,value:"Supprime des messages", inline:true},
                    {name:`${prefix}warn <user> <reason>`,value:"Warn un utilisateur", inline:true},
                    {name:`${prefix}warns <user> (<action(clear-all/clear/add/remove)>) [<number>]`,value:"Affiche les informations des avertissements d'un utilisateur", inline:true},
                    {name:`${prefix}slowmode <time>`,value:"Change le Slowmode du salon actuel", inline:true},
                    {name:`${prefix}lock <reason> (<role>)`,value:"Verrouille un salon pour certains rôles", inline:true},
                )
                .addField("__**Utilitaire**__", "Commandes Supplémentaires et utiles")
                .addFields(
                    {name:`${prefix}announce <msg>`,value:"Envoie un message embed pour annoncer", inline:true},
                    {name:`${prefix}avatar (<user>)`,value:"Montre l'avatar d'un utilisateur", inline:true},
                    {name:`${prefix}dm <user> <msg>`,value:"Envoie un DM à un utilisateur", inline:true},
                    {name:`${prefix}embed (<titre>) <message>`,value:"Affiche un message embed", inline:true},
                    {name:`${prefix}ghostping <mention>`,value:"Mentionne discrètement", inline:true},
                    {name:`${prefix}rules <action>`,value:"Gère le règlement du serveur", inline:true},
                    {name:`${prefix}pub <title> <message>`,value:"Envoie une publicité", inline:true},
                    {name:`${prefix}say <msg>`,value:"Me fais parler", inline:true},
                    {name:`${prefix}serverinfo`,value:"Affiche les infos du serveur", inline:true},
                    {name:`${prefix}userinfo <user>`,value:"Affiche les infos d'un utilisateur", inline:true},
                    {name:`${prefix}logs <action>`,value:"Système de journal d'actions", inline:true},
                    {name:`${prefix}xp <action>`,value:"Système d'Expérience", inline:true},
                )
            message.author.send(EmbedHelp1)

            let EmbedHelp2 = new MessageEmbed()
                .setColor("GOLD")
                .addField("__**Fun**__", "Commandes d'amusement")
                .addFields(
                    {name:`${prefix}bruh`,value:"Envoie un GIF aléatoire de bruh", inline:true},
                    {name:`${prefix}roll`,value:"Choisi un nombre aléatoire entre 1 et 6", inline:true},
                    {name:`${prefix}8ball <wish>`,value:"Magic 8ball", inline:true},
                    {name:`${prefix}love`,value:"Choisi 2 personnes à unire", inline:true},
                )
                .addField("__**Settings**__", "Commandes Supplémentaires et utiles")
                .addFields(
                    {name:`${prefix}s help`,value:"Affiche une page d'aide", inline:true},
                    {name:`${prefix}s info`,value:"Donne la liste des paramètres et des valeurs", inline:true},
                    {name:`${prefix}s prefix <newprefix>`,value:"Change le préfix", inline:true},
                    {name:`${prefix}s join-message <action> <value>`,value:`Configure le join message\n*${prefix}s join-message help*`, inline:true},
                    {name:`${prefix}s leave-message <action> <value>`,value:`Configure le leave message\n*${prefix}s leave-message help*`, inline:true},
                    {name:`${prefix}s auto-react <on/off>`,value:"Permet au bot de réagir aux messages contenants des mots-clés", inline:true},
                    // {name:`${prefix}CMD`,value:"VALUE", inline:true},
                )
                .setFooter(`${config["BotInfo"]["name"]}`, `${config["BotInfo"]["IconURL"]}`)
                .setTimestamp()
            message.delete()
            message.author.send(EmbedHelp2)
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