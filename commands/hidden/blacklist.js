const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const fetch = require('node-fetch');
const {format: prettyFormat} = require('pretty-format');

module.exports = {
    name: 'blacklist',
    description: "Empêche certains utilisateur d'utiliser ce bot",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(message.author.id != config["OwnerID"]) return message.lineReply("Erreur: Vous n'êtes pas le propriétaire du bot")
            let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
            const prefix = prefixes[message.guild.id].prefixes;
            let blacklist = JSON.parse(fs.readFileSync("./DataBase/blacklist.json", "utf8"));
            if(!args[0] || !"helplistaddremove".includes(args[0])) {
                let EmbedHelp = new MessageEmbed()
                .setTitle("BLACKLIST COMMANDS")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("#B80000")
                .addField(`${prefix}blacklist list`, "Liste les utilisateurs blacklistés")
                .addField(`${prefix}blacklist add <UserID>`, "Ajoute un utilisateur à la Blacklist")
                .addField(`${prefix}blacklist remove <UserID>`, "Supprime un utilisateur de la Blacklist")
                .setTimestamp()
                message.channel.send(EmbedHelp)
            }
            if(args[0]=="list") {
                let msg = ""
                if(blacklist.length==0) msg+="None"
                for(let i=0; i<blacklist.length; i++) {
                    msg+=`<@${blacklist[i]}>\n`
                }
                message.lineReply("__**Blacklisted:**__\n"+msg)
            }
            if(args[0]=="add") {
                if(!args[1]) return message.lineReply(`Erreur: Veuillez préciser l'ID d'utilisateur\n*${prefix}blacklist add <user-ID>*`)
                if(args[1]==config["OwnerID"]) return message.lineReply(`Erreur: Impossible de blacklister le propriétaire du bot`)
                if(blacklist.includes(args[1])) return message.lineReply(`Erreur: Cet utilisateur est déjà Blacklisté`)
                blacklist.push(args[1])
                fs.writeFile("./DataBase/blacklist.json", JSON.stringify(blacklist), (err) => {
                    if (err) console.error();
                })
                let EmbedAdd = new MessageEmbed()
                .setTitle("BLACKLIST")
                .setDescription(`<@${args[1]}> a été ajouté à la Blacklist`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("#B80000")
                .setTimestamp()
                message.channel.send(EmbedAdd)
            }
            if(args[0]=="remove") {
                function arrayRemove(arr, value) { 
        
                    return arr.filter(function(ele){ 
                        return ele != value; 
                    });
                }
                if(!args[1]) return message.lineReply(`Erreur: Veuillez préciser l'ID d'utilisateur\n*${prefix}blacklist remove <user-ID>*`)
                if(!blacklist.includes(args[1])) return message.lineReply(`Erreur: Cet utilisateur n'est pas Blacklisté`)

                blacklist = arrayRemove(blacklist, args[1])

                fs.writeFile("./DataBase/blacklist.json", JSON.stringify(blacklist), (err) => {
                    if (err) console.error();
                })
                let EmbedRemove = new MessageEmbed()
                .setTitle("BLACKLIST")
                .setDescription(`<@${args[1]}> a été supprimé de la Blacklist`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("#B80000")
                .setTimestamp()
                message.channel.send(EmbedRemove)
            }
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