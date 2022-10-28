const fs = require('fs')
const fetch = require('node-fetch');

module.exports = {
    name: 'easter-egg',
    description: "GG tu as trouvé l'easter-egg!!!",
    execute(message) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            message.delete()
            message.channel.send(`GG <@${message.author.id}>, tu as trouvé le premier easter egg\nJe t'ai envoyé l'indice du deuxième en message privé\nQue la chasse aux easter eggs commence!!!`)
            message.author.send(`GG <@${message.author.id}>, tu as trouvé le premier easter egg\n*PS: évite de partager la commande 😅*\nIndice n°2: (en dev)`)
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