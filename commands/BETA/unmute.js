const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const fetch = require('node-fetch');

module.exports = {
    name: 'unmute',
    description: "Unmute un membre",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
            const prefix = prefixes[message.guild.id].prefixes;
            if(!message.member.hasPermission("KICK_MEMBERS") && message.author.id != config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="off") return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Kick des Membres)")
            if(!args[0]) return message.lineReply(`Erreur: Veuillez préciser un utilisateur\n*${prefix}unmute <user> (<reason>)*`)

            const User = message.mentions.users.first();
            if(!User) return message.lineReply(`Erreur: Veuillez préciser un utilisateur valide\n*${prefix}unmute <user> (<reason>)*`)

            let reason = args.slice(1).join(" ");
            if(!reason) reason = 'Non spécifié';
            
            function RemoveMuteRole() {
                let MuteRole = message.guild.roles.cache.find(role => role.name === "Muted");
                if(!message.guild.member(User).roles.cache.some(role => role.name === "Muted")) return message.lineReply(`Erreur: Ce membre n'est pas Mute`)
                message.guild.member(User).roles.remove(MuteRole, `${message.author.tag}: ${reason}`).catch(console.error);



                const Embed = new MessageEmbed()
                .setTitle("UNMUTE")
                .setDescription(`Un utilisateur a été unmute`)
                .setAuthor(User.tag, User.displayAvatarURL())
                .setColor("#79E300")
                .setThumbnail(User.displayAvatarURL())
                .addFields(
                    {name:"Modérateur",value:`${message.author}`,inline:true},
                    {name:"Membre",value:`${User}`,inline:true},
                    {name:"Raison",value:`${reason}`,inline:true},
                )
                .setTimestamp()
                message.delete()
                message.channel.send(Embed)
            }

            let CheckMuteRole = message.guild.roles.cache.find(role => role.name === "Muted");
            if(!CheckMuteRole) {
                // message.guild.roles.create({name:"Muted", color: "818386", mentionable: false, permissions:[]});

                async function CreateMuteRole() {
                    // console.log("Awaiting...")
                    await message.guild.roles.create({
                        data: {
                          name: 'Muted',
                          color: '818386',
                        //   Permissions: []
                        //   Permissions: 0
                        //   Permissions: new Discord.Permissions(0)
                        //   Permissions: ["ALL", false]
                        //   Permissions: false
                        },
                        // reason: 'we needed a role for Super Cool People',
                    }).then((role) => {
                        message.guild.channels.cache.forEach(async (channel, id) => {
                            await channel.createOverwrite(role, {
                               SEND_MESSAGES: false,
                            });
                            // console.log("GIVE CHANNEL")
                        });
                    })
                    .catch(console.error);


                    // console.log("Awaited")
                    RemoveMuteRole()
                }
                CreateMuteRole()
            } else RemoveMuteRole()
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