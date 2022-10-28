const fs = require("fs")

module.exports = {
    name: 'clear',
    description: "Supprime des messages",
    usage: "clear <nb>",
    category: "Moderation",
    execute(message, args) {
      let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
      try {
        if(!(message.member.hasPermission("MANAGE_MESSAGES") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Gérer les Messages)")
        if(Number(args[0]) <= 0 || isNaN(args[0])) return message.lineReply("Erreur: Veuillez préciser un nombre supérieur à 0")
        const amount = Number(args[0]) > 100
            ? 101
            : Number(args[0]) + 1;
        message.channel.bulkDelete(amount, true)
          .then((_message) => {
            message.channel
              .send(`:broom: \`${_message.size-1}\` messages supprimés`)
              .then((sent) => {
                setTimeout(() => {
                  sent.delete();
                }, 2500);
              });
          }).catch(error => {
            message.lineReply(`Erreur: Impossible de supprimer ce nombre de message`)
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