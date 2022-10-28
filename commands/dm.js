const { MessageEmbed } = require("discord.js");
const fs = require("fs")

module.exports = {
    name: 'dm',
    description: "Envoie un DM à un utilisateur",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(!message.member.hasPermission("ADMINISTRATOR") && message.author.id != config["CreatorID"] && fs.readFileSync("./DataBase/admin", "utf8")=="off") return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Administrateur)")
            let dmUser = message.mentions.users.first();
            if(!args[0]) return message.lineReply("Erreur: Veuillez préciser un utilisateur")
            if(!dmUser) return message.channel.send("Erreur: Veuillez préciser un utilisateur valide")
            //if(dmUser.id == "782885398316711966") return message.channel.send("ERREUR: Veuillez préciser un utilisateur valide (pas moi de préférence)")
            if(!args[1]) return message.lineReply("Erreur: Veuillez préciser un message")
            const dmMessage = args.slice(1).join(" ");
            // dmUser.send(`__Message de ${message.author} provenant de **${message.guild.name}**__\n${dmMessage}`)

            let Embed = new MessageEmbed()
            .setTitle(`__Message Privé__`)
            .setColor("AQUA")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`**Message de ${message.author} provenant de *${message.guild.name}***`)
            .addField(`\u200b`, `${dmMessage}`)
            .setTimestamp()
            dmUser.send(Embed)
            message.delete()
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