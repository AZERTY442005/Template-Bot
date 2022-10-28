const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const fetch = require('node-fetch');
const {format: prettyFormat} = require('pretty-format'); // CommonJS

module.exports = {
    name: 'warn',
    description: "Averti un utilisateur",
    usage: "warn <user> <reason>",
    category: "Moderation",
    execute(message, args) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(!(message.member.hasPermission("KICK_MEMBERS") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Kick des Membres)")
            if(!args[0])return message.lineReply(`Erreur: Vous devez préciser la personne\n${prefix}*warn <user> <reason>*`)

            // console.log("TEST0")

            let warns = JSON.parse(fs.readFileSync("./DataBase/warns.json", "utf8"));

            let UserWarn = message.mentions.users.first()||null

            // try{
            //     console.log("TEST1: "+prettyFormat(warns))
            //     console.log("TEST2: "+warns[message.guild.id][UserWarn.id])
            //     console.log("TEST3: "+warns[message.guild.id][UserWarn.id].warns)
            // } catch (error) {
            //     console.log("Error: "+error)
            // }
            if(!warns[message.guild.id]) warns[message.guild.id]={}
            if(!warns[message.guild.id][UserWarn.id]) {
                warns[message.guild.id][UserWarn.id] = {
                    warns: 0,
                }
                // console.log("Warns: "+prettyFormat(warns[message.guild.id]))
                fs.writeFile("./DataBase/warns.json", JSON.stringify(warns), (err) => {
                    if (err) console.error();
                })
            }

            // console.log("TEST2: "+prettyFormat(warns))

            try { // Test
                // console.log("ParseInt: "+parseInt(warns[message.guild.id][UserWarn.id].warns))
                UserWarns = parseInt(warns[message.guild.id][UserWarn.id].warns)
            } catch (e) {
                console.error("Error: "+e)
            }


            const ReasonWarn = args.slice(1).join(" ");
            if(UserWarn==null)return message.lineReply(`Erreur: Vous devez préciser la personne\n*${prefix}warn <user> <reason>*`)
            if(!args[1])return message.lineReply(`Erreur: Vous devez préciser la raison\n*${prefix}warn <user> <reason>*`)
            let AvatarWarn = UserWarn.displayAvatarURL()
            //let ChannelWarn = message.guild.channels.cache.find(channel => channel.name === "warns")
            let EmbedWarn = new MessageEmbed()
            .setTitle(`WARN`)
            .setDescription(`Un utilisateur a été Warn`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("ORANGE")
            .setThumbnail(AvatarWarn)
            .addFields(
                {name:"Modérateur",value:`${message.author}`,inline:true},
                {name:"Membre",value:`${UserWarn}`,inline:true},
                {name:"Raison",value:`${ReasonWarn}`,inline:true},
            )
            .setTimestamp()
            message.channel.send(EmbedWarn)
            
            warns[message.guild.id][UserWarn.id] = {
                warns: UserWarns + 1,
            }
            fs.writeFile("./DataBase/warns.json", JSON.stringify(warns), (err) => {
                if (err) console.error();
            })
            // console.log("UserWarns B: "+UserWarns)
            UserWarns=UserWarns+1
            // console.log("UserWarns A: "+UserWarns)

            // console.log("TEST3")
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