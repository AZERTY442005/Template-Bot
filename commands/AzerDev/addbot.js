const fs = require('fs')
const fetch = require('node-fetch');

module.exports = {
    name: 'addbot',
    description: "Ajoute un bot sur AzerDev",
    execute(message, args) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            // if(message.guild.id!="804461788367683595") return
            if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Administrateur)")
            if(!args[0]) return message.lineReply(`Erreur: Veuillez préciser la mention du Bot\n*${prefix}addbot <mention> <channel-id>*`)
            const AddBot = message.mentions.users.first()
            if(!AddBot) return message.lineReply(`Erreur: Veuillez mentionner un Bot`)
            if(!AddBot.bot) return message.lineReply(`Erreur: Veuillez préciser uniquement un Bot`)
            if(!args[1]) return message.lineReply(`Erreur: Veuillez préciser l'ID du salon\n*${prefix}addbot <mention> <channel-id>*`)
            const BotChannel = message.guild.channels.cache.find(channel => channel.id === args[1])
            if(!BotChannel) return message.lineReply(`Erreur: Veuillez préciser un ID de salon valide`)

            console.log(AddBot)
            console.log(BotChannel)

            let CheckRole = message.guild.roles.cache.find(role => role.name === BotChannel.name);
            if(!CheckRole) message.guild.roles.create({name:BotChannel.name, mentionable: false, permissions:[]});
            let myRole = message.guild.roles.cache.find(role => role.name === BotChannel.name);
            AddBot.addRole(myRole);
            
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