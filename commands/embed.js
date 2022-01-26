const { MessageEmbed } = require("discord.js");
const { title } = require("process");
const fs = require('fs')

module.exports = {
    name: 'embed',
    description: "Me fait écrire un message embed",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
    //        if(!args[0]) return message.channel.send("ERREUR: Veuillez préciser une couleur")
            if(!args[0]) return message.lineReply(`Erreur: Veuillez préciser un titre ou un message\n*embed (<titre>) <message>*`)
            if(args[1]) {
                const title1 = args[0]
                const desc1 = args.slice(1).join(" ");
    //            const color1 = args[0]
                let embed1 = new MessageEmbed()
                .setTitle(`${title1}`)
                .setDescription(`${desc1}`)
                .setColor("RANDOM")
            message.channel.send(embed1)
            message.delete()
            } else {
                const desc2 = args.slice(0).join(" ");
    //            const color2 = args[0]
                let embed2 = new MessageEmbed()
                .setDescription(`${desc2}`)
                .setColor("RANDOM")
            message.channel.send(embed2)
            message.delete()
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