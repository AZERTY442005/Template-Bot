const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch');

module.exports = {
    name: 'ban',
    description: "Ban un utilisateur",
    execute(message, args) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(!message.member.hasPermission("BAN_MEMBERS") && message.author.id != config["CreatorID"] && fs.readFileSync("./DataBase/admin", "utf8")=="off") return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Bannir des Membres)")
            if(!args[0]) return message.lineReply(`Erreur: Veuillez préciser un utilisateur\n*${prefix}ban <user> (<reason>)*`)
            message.delete()
            const userBan = message.mentions.users.first();
            if (userBan) {
                const member = message.guild.member(userBan);
                let reasonBan = args.slice(1).join(" ");
                if(!reasonBan) reasonBan = 'Non spécifié';
                if (member){
                    member.ban(`${message.author.tag}: ${reasonBan}`).then(() =>{
                        let AvatarBan = userBan.displayAvatarURL()
                        let EmbedBan = new MessageEmbed()
                            .setTitle(`BAN`)
                            .setDescription(`Un utilisateur a été banni du serveur`)
                            .setAuthor(message.author.tag, message.author.displayAvatarURL())
                            .setColor("RED")
                            .setThumbnail(AvatarBan)
                            .addFields(
                                {name:"Modérateur",value:`${message.author}`,inline:true},
                                {name:"Membre Banni",value:`${userBan}`,inline:true},
                                {name:"Raison",value:`${reasonBan}`,inline:true},
                                // {name:"Mod ID",value:`${message.author.id}`,inline:true},
                                // {name:"Banned ID",value:`${userBan.id}`,inline:true},
                                // {name:"Date (M/D/Y)",value:`${new Intl.DateTimeFormat("en-US").format(Date.now())}`,inline:true}
                            )
                            .setTimestamp()
                            message.channel.send(EmbedBan)
                    }).catch(error => {
                        if(error=="DiscordAPIError: Missing Permissions") {
                            message.lineReply("Erreur: je n'ai pas les permissions suffisantes pour ban cet utilisateur")
                        } else {
                            message.lineReply(`Erreur: Impossible de ban cet utilisateur\n\`${error}\``)
                        }
                    })
                } else {
                    message.lineReply(`Erreur: Cet utilisasteur n'est pas sur ce serveur`);
                }
            }
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