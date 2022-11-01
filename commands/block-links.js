const { MessageEmbed } = require("discord.js");
const fs = require("fs")
const fetch = require('node-fetch');
const UserErrorNoPermissions = require("../Functions/UserErrorNoPermissions.js")
const UserError = require("../Functions/UserError.js")
const Error = require("../Functions/Error.js")

module.exports = {
    name: 'block-links',
    description: {"fr": "Bloque les liens indésirés", "en": "Blocks the undesired links"},
    aliases: ["bl"],
    usage: "block-links help",
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
            const BlockedLinks = fs.readFileSync("./DataBase/blocked-links.txt", "utf8").split("\n")
            if(!(message.member.hasPermission("ADMINISTRATOR") || (message.author.id == config["CreatorID"] && fs.readFileSync("./DataBase/admin.txt", "utf8")=="on"))) return UserErrorNoPermissions("ADMINISTRATOR", bot, message, __filename)
            if(!args[0] || args[0]=="help" || !"helplistaddremove".includes(args[0])) {
                let Embed = new MessageEmbed()
                .setTitle("BLOCK-LINKS COMMANDS")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("ORANGE")
                .addField(`${prefix}block-links help`, `Affiche cette page`)
                .addField(`${prefix}block-links list`, `Liste les liens indésirés`)
                .addField(`${prefix}block-links add`, `Ajoute un lien indésiré`)
                .addField(`${prefix}block-links remove`, `Supprime un lien indésiré`)
                .setTimestamp()
                message.lineReplyNoMention(Embed)
            }
            if(args[0]=="list") {
                let Embed = new MessageEmbed()
                .setTitle("BLOCK-LINKS LIST")
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("ORANGE")
                .setDescription(`*(Don't click)*\n${BlockedLinks.join("\n")}`)
                .setTimestamp()
                message.lineReplyNoMention(Embed)
            }
            if(args[0]=="add") {
                if(!args[1]) return UserError("SpecifyLink", bot, message, __filename)
                if(!args[1].includes("http") || !args[1].includes("://") ) return Error("SpecifyValidLink", bot, message, __filename)
                BlockedLinks.push(args[1])
                fs.writeFile("./DataBase/blocked-links.txt", BlockedLinks.join("\n"), (err) => {
                    if (err) console.error();
                })

            }
            if(args[0]=="remove") {
                console.log("arr: "+BlockedLinks)
                console.log("link: "+args[1])
                if(!args[1]) return UserError("SpecifyLink", bot, message, __filename)
                if(!args[1].includes("http") || !args[1].includes("://") ) return Error("SpecifyValidLink", bot, message, __filename)
                if(!BlockedLinks.includes(args[1])) return Error("UnknownBlockedLink", bot, message, __filename)

                for(var i=0;i<BlockedLinks.length;i++){
                    if (BlockedLinks[i]===args[1]) { 
                        BlockedLinks.splice(i, 1); 
                        i--; 
                    }
                }

                fs.writeFile("./DataBase/blocked-links.txt", BlockedLinks.join("\n"), (err) => {
                    if (err) console.error();
                })
            }




            // if(!args[0]) UserError("", bot, message, __filename)

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