const { MessageEmbed } = require("discord.js");
const fs = require('fs');
// const { url } = require("inspector");

module.exports = {
    name: 'pub',
    description: "Envoie une publicité",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
            const prefix = prefixes[message.guild.id].prefixes;
            if(!(message.member.hasPermission("MANAGE_MESSAGES") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Gérer les Messages)")
            if(!args[0]) return message.lineReply(`Erreur: Vous devez spécifier le titre\n*${prefix}pub <title> <message>*`)
            if(!args[1]) return message.lineReply(`Erreur: Vous devez spécifier le message\n*${prefix}pub <title> <message>*`)
            let title = args[0]
            let description = args.slice(1).join(" ");

            let Embed = new MessageEmbed()
                .setTitle(`Publicité`)
                .addField(`${title}`, `${description}`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor(message.member.displayHexColor)
                .setTimestamp()
            message.channel.send(Embed)
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