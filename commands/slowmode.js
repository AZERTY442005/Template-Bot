const { MessageEmbed } = require("discord.js")
const fs = require("fs")
const ms = require('ms');
const fetch = require('node-fetch');

module.exports = {
    name: 'slowmode',
    description: "Toogle Slowmode",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(!(message.member.hasPermission("MANAGE_CHANNELS") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Gérer les Salons)")
            let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
            const prefix = prefixes[message.guild.id].prefixes;
            if(!args[0]) return message.lineReply(`Erreur: Veuillez préciser un délai\n*${prefix}slowmode <time S-H-D>*`)
            // let time_seconds = args[0]
            
            const time = ms(args[0]) / 1000 // TEST

            let reason = args.slice(1).join(" ");
            if(!reason) reason = 'Non spécifié';
            if(time < 0 || time > 21600 || Number.isNaN(time)) return message.lineReply(`Erreur: Veuillez préciser un délai entre 0 et 21600 secondes\n\`${args[0]} = ${ms(args[0]) / 1000} secondes\``)
            message.delete()
            message.channel.setRateLimitPerUser(time, `${message.author.tag}: ${reason}`)
            let Embed = new MessageEmbed()
            .setTitle("SLOWMODE")
            .setDescription(`Le Slowmode a changé`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("#B200FF")
            .setThumbnail(message.author.displayAvatarURL())
            .addFields(
                {name:`Temps`,value:`${args[0]}`,inline:true},
                {name:`Raison`,value:`${reason}`,inline:true},
                {name:`Utilisateur`,value:`${message.author}`,inline:true},
            )
            .setTimestamp()
            message.channel.send(Embed)
            return
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