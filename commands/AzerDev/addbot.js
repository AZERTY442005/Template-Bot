const fs = require('fs')
const fetch = require('node-fetch');
const UserError = require("../../Functions/UserError.js")

module.exports = {
    name: 'addbot',
    description: "Ajoute un bot sur AzerDev",
    aliases: [],
    usage: "addbot <bot-mention> <channel-id>",
    category: "Custom",
    execute(message, args, bot) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(message.guild.id!="804461788367683595") return
            return message.lineReply(`Commande désactivée (en développement)`)
            if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Administrateur)")
            if(!args[0]) return UserError("Veuillez préciser la mention du bot", bot, message, __filename)
            const AddBot = message.mentions.users.first()
            if(!AddBot) return UserError("Veuillez mentionner un bot", bot, message, __filename)
            if(!AddBot.bot) return UserError("Veuillez préciser uniquement un bot", bot, message, __filename)
            if(!args[1]) return UserError("Veuillez préciser l'ID du salon", bot, message, __filename)
            const BotChannel = message.guild.channels.cache.find(channel => channel.id === args[1])
            if(!BotChannel) return UserError("Veuillez préciser un ID de salon valide", bot, message, __filename)

            console.log(AddBot)
            console.log(BotChannel)

            let CheckRole = message.guild.roles.cache.find(role => role.name === BotChannel.name);
            if(!CheckRole) message.guild.roles.create({name:BotChannel.name, mentionable: false, permissions:[]});
            let myRole = message.guild.roles.cache.find(role => role.name === BotChannel.name);
            AddBot.addRole(myRole);
            
        } catch (error) { // ERROR PREVENTER
            console.error(`${error}`)
            Embed = new MessageEmbed()
            .setTitle(`Une erreur est survenue`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("RED")
            message.lineReplyNoMention(Embed)
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