const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const fetch = require('node-fetch');

module.exports = {
    name: 'reactionrole',
    description: "Reactionrole",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
            const prefix = prefixes[message.guild.id].prefixes;
            if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Administrateur)")
            if(!args[0]) return message.lineReply(`Erreur: Veuillez préciser le rôle\n*${prefix}reactionrole <role> <reaction> <message>*`)
            if(!args[1]) return message.lineReply(`Erreur: Veuillez préciser la réaction\n*${prefix}reactionrole <role> <reaction> <message>*`)
            if(!args[2]) return message.lineReply(`Erreur: Veuillez préciser le message\n*${prefix}reactionrole <role> <reaction> <message>*`)
            
            if(!message.mentions.roles.first()) return message.lineReply(`Erreur: Veuillez préciser un rôle valide`)
            const Role = message.mentions.roles.first()

            const Emoji = args[1]

            const Message = args.slice(2).join(" ");

            let Embed = new MessageEmbed()
            .setTitle("REACTIONROLE")
            .setDescription(Message)
            .setColor("GOLD")
            message.channel.send(Embed).then(msg => {
                msg.react(Emoji).catch(err => {
                    msg.delete()
                    if(err=="DiscordAPIError: Unknown Emoji") return message.lineReply(`Erreur: Veuillez préciser un émoji valide`)
                })
                // const Filter = (reaction, user) => user.id == message.author.id;
                // msg.awaitReactions(Filter, {max: 1, time: 30000, errors: ["time"]}).then(collected => {
                //     const reaction = collected.first();
                    
                //     switch (reaction.emoji.name) {
                //         case Emoji:
                //             // Checking if the member already has the role.
                //             if (message.member.roles.cache.has(Role.id)) return message.channel.send("You already have the role")
                //             // Adding the role.
                //             message.member.roles.add(Role).then(message.channel.send("Role added!"));
                //             // Breaking the switch statement to make sure no other cases are executed.
                //             break
                //     }
                // })
            })

            bot.on('messageReactionAdd', async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;
                if (!reaction.message.guild) return;
     
                if (reaction.message.channel.id == message.channel.id) {
                    if (reaction.emoji.name === Emoji) {
                        await reaction.message.guild.members.cache.get(user.id).roles.add(Role);
                    }
                } else {
                    return;
                }
     
            });
     
            bot.on('messageReactionRemove', async (reaction, user) => {
     
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;
                if (!reaction.message.guild) return;
     
     
                if (reaction.message.channel.id == message.channel.id) {
                    if (reaction.emoji.name === Emoji) {
                        await reaction.message.guild.members.cache.get(user.id).roles.remove(Role);
                    }
                } else {
                    return;
                }
            });
            

            
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