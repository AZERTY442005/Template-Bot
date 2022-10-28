const { MessageEmbed } = require("discord.js");
const fs = require("fs")

module.exports = {
    name: 'kick',
    description: "Kick un utilisateur",
    usage: "kick <user> <reason>",
    category: "Moderation",
    execute(message, args) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(!(message.member.hasPermission("KICK_MEMBERS") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Kick des Membres)")
            if(!args[0]) return message.lineReply(`Erreur: Veuillez préciser un utilisateur\n*${prefix}kick <user> <reason>*`)
            const userKick = message.mentions.users.first();
            if(!userKick) return message.lineReply(`Erreur: Veuillez préciser un utilisateur valide`)
            const member = message.guild.member(userKick);
            let reasonKick = args.slice(1).join(" ");
            // if(!reasonKick) reasonKick = 'Non spécifié';
            if(!reasonKick) return message.lineReply(`Erreur: Veuillez préciser une raison`)
            if(!member) return message.lineReply(`Erreur: Veuillez préciser un utilisateur valide`)
            // message.author.send("pjmqldg")
            // userKick.send("iosqhd") //ERROR
            member.kick(`${message.author.tag}: ${reasonKick}`).then(() =>{
                let AvatarKick = userKick.displayAvatarURL()
                let EmbedKick = new MessageEmbed()
                    .setTitle(`KICK`)
                    .setDescription(`Un utilisateur à été kick du serveur`)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor("ORANGE")
                    .setThumbnail(AvatarKick)
                    .addFields(
                        {name:"Modérateur",value:`${message.author}`,inline:true},
                        {name:"Membre",value:`${userKick}`,inline:true},
                        {name:"Raison",value:`${reasonKick}`,inline:true},
                    )
                    .setTimestamp()
                message.channel.send(EmbedKick)
                message.delete()
            }).catch(error => {
                if(error=="DiscordAPIError: Missing Permissions") {
                    message.lineReply(`Erreur: je n'ai pas les permissions suffisantes pour kick cet utilisateur`)
                } else {
                    message.lineReply(`Erreur: Impossible de kick cet utilisateur\n${error}`)
                }
            })
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