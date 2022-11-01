const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const ms = require('ms')
const fetch = require('node-fetch');
const { PassThrough } = require("stream");
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'mute',
    description: "Mute quelqu'un",
    aliases: [],
    usage: "mute <user> <time> <reason>",
    category: "Moderation",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
            const prefix = prefixes[message.guild.id].prefixes;
            if(!(message.member.hasPermission("KICK_MEMBERS") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("Kick des Membres", bot, message, __filename)
            if(!args[0]) return UserError("Veuillez préciser l'utilisateur", bot, message, __filename)
            if(!args[1]) return UserError("Veuillez préciser une durée (ex: 1h, 3j, 2w, def)", bot, message, __filename)
            const MuteUser = message.mentions.users.first();

            let durationDisplay = args[1]
            let duration = ms(args[1])
            if(durationDisplay=="def" || durationDisplay=="perm") duration = "def"
            if(!duration) return UserError("Veuillez préciser une durée valide", bot, message, __filename)

            const reason = args.slice(2).join(" ");
            if(!reason) return UserError("Veuillez préciser une raison", bot, message, __filename)


            function GiveMuteRole() {
                let MuteRole = message.guild.roles.cache.find(role => role.name === "Muted");
                message.guild.member(MuteUser).roles.add(MuteRole, `${message.author.tag}: ${reason}`).catch(console.error);

                const Embed = new MessageEmbed()
                .setTitle("MUTE")
                .setDescription(`Un utilisateur a été mute`)
                .setAuthor(MuteUser.tag, MuteUser.displayAvatarURL())
                .setColor("#E2A100")
                .setThumbnail(MuteUser.displayAvatarURL())
                .addFields(
                    {name:"Modérateur",value:`${message.author}`,inline:true},
                    {name:"Membre",value:`${MuteUser}`,inline:true},
                    {name:"Durée",value:`${durationDisplay}`,inline:true},
                    {name:"Raison",value:`${reason}`,inline:true},
                )
                .setTimestamp()
                message.delete()
                message.channel.send(Embed)

                if(duration!="def") {
                    fs.writeFile("./DataBase/requests.txt", `${parseInt(fs.readFileSync("./DataBase/requests.txt", "utf8"))+1}`, (err) => {
                        if (err) console.error();
                    })
                    setTimeout(function(){
                        const Embed = new MessageEmbed()
                        .setTitle("UNMUTE")
                        .setDescription(`Un utilisateur a été unmute automatiquement au bout de **${durationDisplay}**`)
                        .setAuthor(MuteUser.tag, MuteUser.displayAvatarURL())
                        .setColor("#79E300")
                        .setThumbnail(MuteUser.displayAvatarURL())
                        .setTimestamp()
                        message.channel.send(Embed)
                        const Embed2 = new MessageEmbed()
                        .setTitle("UNMUTE")
                        .setDescription(`Tu as été unmute de __${message.guild.name}__ automatiquement au bout de **${durationDisplay}**`)
                        .setAuthor(MuteUser.tag, MuteUser.displayAvatarURL())
                        .setColor("#79E300")
                        .setThumbnail(MuteUser.displayAvatarURL())
                        .setTimestamp()
                        MuteUser.send(Embed2)
                        message.guild.member(MuteUser).roles.remove(MuteRole, `Unmute automatique au bout de ${durationDisplay}`).catch(console.error);
                        fs.writeFile("./DataBase/requests.txt", `${parseInt(fs.readFileSync("./DataBase/requests.txt", "utf8"))-1}`, (err) => {
                            if (err) console.error();
                        })
                    }, duration)
                }
            }


            let CheckMuteRole = message.guild.roles.cache.find(role => role.name === "Muted");
            if(!CheckMuteRole) {
                // message.guild.roles.create({name:"Muted", color: "818386", mentionable: false, permissions:[]});

                async function CreateMuteRole() {
                    await message.guild.roles.create({
                        data: {
                          name: 'Muted',
                          color: '818386'
                        },
                    }).then(role => {
                        message.guild.channels.cache.forEach(async (channel, id) => {
                            await channel.createOverwrite(role, {
                               SEND_MESSAGES: false,
                            });
                         });
                    }).catch(console.error);
                    

                    GiveMuteRole()
                }
                CreateMuteRole()
            } else GiveMuteRole()



        } catch (error) { // ERROR PREVENTER
            console.error(`${error}`)
            Embed = new MessageEmbed()
            .setTitle(`Une erreur est survenue`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("RED")
            message.lineReplyNoMention(Embed)
            var URL = fs.readFileSync("./DataBase/webhook-logs-.txt", "utf8")
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