const fs = require('fs')
const {format: prettyFormat} = require('pretty-format');



module.exports = {
    name: 'test',
    description: "Permet de tester une commande test",
    execute(message, args, bot) {
        // if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("ERREUR: Vous n'avez pas la permission de faire ceci!")
        if(message.author.id != "452454205056352266") return
        if(!args[0]) return message.reply("Erreur: Veuillez préciser un test")
//        if(args[0] == "join-message") {
//            const msg = `Welcome <@${message.member.id}> to the server`
//            const channel = message.guild.channels.cache.get("782886209059029015")
//            channel.send(msg)
//        }
        // if(args[0] == "join-message") {
        //     let join_message_status = JSON.parse(fs.readFileSync("./DataBase/join-message-status.json", "utf8"))
        //     let join_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/join-message-channel-id.json", "utf8"))
        //     if(join_message_status[message.guild.id].join_message_status == "on") {
        //         const Message = `Bienvenue <@${message.author.id}> sur **${message.guild.name}**`
        //         const Channel = message.guild.channels.cache.get(join_message_channel_id[message.guild.id].join_message_channel_id)
        //         Channel.send(Message)
        //     } else {
        //         message.channel.send(`Le join message est désactivé:\n*s join-message set-status on*`)
        //     }
        // }
        if(args[0] == "leave-message") {
            const msg2 = `Bye <@${message.member.id}>`
            const channel2 = message.guild.channels.cache.get("525370770126274561")
            channel2.send(msg2)
        }
        if(args[0] == "add-role") {
            message.user.roles.add(message.guild.roles.cache.find(i => i.name === 'member')) // ERROR
        }
        // if(args[0] == "prefix") {
        //     message.reply(prettyFormat(bot.prefixes))
        // }
        if(args[0] == "edit") {
            message.channel.send("Beep").then(msg => {
                setTimeout(() => {
                    msg.edit("Boop!")
                    setTimeout(() => {
                        msg.react("👋")
                    }, 1000);
                }, 1000);
            })
        }
        if(args[0] == "delete") {
            message.channel.send("Ce message se supprime dans 3 secondes").then(r => {
                setTimeout(() => {
                    r.delete()
                }, 3000)
            })
        }
        if(args[0] == "deleteclean") {
            message.channel.send("Ces messages se suppriment dans 3 secondes").then(r => {
                setTimeout(() => {
                    message.delete()
                    r.delete()
                }, 3000)
            })
        }
        // if(args[0] == "linereply") {
        //     message.lineReply('Hey');
        //     message.lineReplyNoMention(`My name is Template Bot`);
        // }
        if(args[0] == "wait") {
            let filter = m => m.author.id === message.author.id
            message.channel.send(`Are you sure to delete all data? \`YES\` / \`NO\``).then(() => {
            message.channel.awaitMessages(filter, {
                max: 1,
                time: 30000,
                errors: ['time']
                })
                .then(message => {
                message = message.first()
                if (message.content.toUpperCase() == 'YES' || message.content.toUpperCase() == 'Y') {
                    message.channel.send(`Deleted`)
                } else if (message.content.toUpperCase() == 'NO' || message.content.toUpperCase() == 'N') {
                    message.channel.send(`Terminated`)
                } else {
                    message.channel.send(`Terminated: Invalid Response`)
                }
                })
                .catch(collected => {
                    message.channel.send('Timeout');
                });
            })
        }
        if(args[0] == "getchannel") {
            function getChannelFromMention(mention) {
                if (!mention) return;
            
                if (mention.startsWith('<#') && mention.endsWith('>')) {
                    mention = mention.slice(2, -1);
            
                    if (mention.startsWith('!')) {
                        mention = mention.slice(1);
                    }
            
                    return client.users.cache.get(mention);
                }
            }
            console.log(getChannelFromMention(args[0]))
            console.log(message.mentions.members.first())
        }
        // if(args[0] == "isnumber") {
        //     console.log(isNaN(args[1]))
        // }
        // if(args[0] == "floor") {
        //     console.log(Math.floor(Number(args[1])))
        // }
    }
}