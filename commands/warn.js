const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const fetch = require('node-fetch');
const {format: prettyFormat} = require('pretty-format')
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'warn',
    description: {"fr": "Averti un utilisateur", "en": "Warn a user"},
    aliases: [],
    usage: "warn <user> <reason>",
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
            if(!(message.member.hasPermission("KICK_MEMBERS") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("KICK_MEMBERS", bot, message, __filename)
            if(!args[0]) return UserError("SpecifyUser", bot, message, __filename)

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
            if(UserWarn==null) return UserError("SpecifyUser", bot, message, __filename)
            if(!args[1]) return UserError("SpecifyReason", bot, message, __filename)
            let AvatarWarn = UserWarn.displayAvatarURL()
            //let ChannelWarn = message.guild.channels.cache.find(channel => channel.name === "warns")
            let EmbedWarn = new MessageEmbed()
            .setTitle(`WARN`)
            .setDescription(`${message_language[languages[message.guild.id]]["WarnDescription"]}`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("ORANGE")
            .setThumbnail(AvatarWarn)
            .addFields(
                {name:`${message_language[languages[message.guild.id]]["Moderator"]}`,value:`${message.author}`,inline:true},
                {name:`${message_language[languages[message.guild.id]]["Member"]}`,value:`${UserWarn}`,inline:true},
                {name:`${message_language[languages[message.guild.id]]["Reason"]}`,value:`${ReasonWarn}`,inline:true},
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