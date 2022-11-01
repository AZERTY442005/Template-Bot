const { MessageEmbed } = require("discord.js");
const fs = require('fs')
const fetch = require('node-fetch');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const Error = require("../Functions/Error.js")
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'unmute',
    description: {"fr": "Unmute un membre", "en": "Unmute a member"},
    aliases: [],
    usage: "unmute <user> (<reason>)",
    category: "Moderation",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
        let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"));
        if(!languages[message.guild.id]) {
            languages[message.guild.id] = "en"
        }
        try {
            if(!message.member.hasPermission("KICK_MEMBERS") && message.author.id != config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="off") return UserErrorNoPermissions("KICK_MEMBERS", bot, message, __filename)
            if(!args[0]) return UserError("SpecifyUser", bot, message, __filename)

            const User = message.mentions.users.first();
            if(!User) return Error("SpecifyValidUser", bot, message, __filename)

            let reason = args.slice(1).join(" ");
            if(!reason) reason = `${message_language[languages[message.guild.id]]["Unspecified"]}`;
            
            function RemoveMuteRole() {
                let MuteRole = message.guild.roles.cache.find(role => role.name === "Muted");
                if(!message.guild.member(User).roles.cache.some(role => role.name === "Muted")) return Error("ThisUserIsNotMuted", bot, message, __filename)
                message.guild.member(User).roles.remove(MuteRole, `${message.author.tag}: ${reason}`).catch(console.error);



                const Embed = new MessageEmbed()
                .setTitle("UNMUTE")
                .setDescription(`${message_language[languages[message.guild.id]]["UnmuteDescription"]}`)
                .setAuthor(User.tag, User.displayAvatarURL())
                .setColor("#79E300")
                .setThumbnail(User.displayAvatarURL())
                .addFields(
                    {name:`${message_language[languages[message.guild.id]]["Moderator"]}`,value:`${message.author}`,inline:true},
                    {name:`${message_language[languages[message.guild.id]]["Member"]}`,value:`${User}`,inline:true},
                    {name:`${message_language[languages[message.guild.id]]["Reason"]}`,value:`${reason}`,inline:true},
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
            Embed = new MessageEmbed()
            .setTitle(`${message_language[languages[message.guild.id]]["ErrorPreventer"]}`)
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