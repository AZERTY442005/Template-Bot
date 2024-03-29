const {format: prettyFormat} = require('pretty-format');
const fs = require('fs')
const fetch = require('node-fetch');
const Error = require("../Functions/Error.js")

module.exports = {
    name: 'love',
    description: {"fr": "Fait rencontrer 2 membres", "en": "Meet 2 members"},
    aliases: [],
    usage: "love",
    category: "Fun",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            // console.log(prettyFormat(message.guild.members))
            // const list = bot.guilds.cache.get(message.guild.id);
            const MembersList = []
            message.guild.members.cache.forEach(member => {
                if(!member.user.bot) MembersList.push(member.user)
            });
            // console.log(prettyFormat(MembersList))
            if(MembersList.length==1) return Error("YouAreAlone", bot, message, __filename)
            // console.log("RANDOM1 "+Math.random())
            // console.log("RANDOM2 "+Math.random())
            // console.log("RANDOM3 "+Math.random())
            const members = {
                "member1": MembersList[Math.floor(Math.random() * (MembersList.length))],
                "member2": MembersList[Math.floor(Math.random() * (MembersList.length))],
            }
            // console.log("R member: "+Math.floor(Math.random() * (MembersList.length)))
            // const member2 = MembersList[Math.floor(Math.random() * (MembersList.length))]
            while(members["member1"]==members["member2"]) {
                members.member2 = MembersList[Math.floor(Math.random() * (MembersList.length - 1) + 1)]
            }
            message.channel.send("<@"+members["member1"].id+"> ❤ <@"+members["member2"].id+">")
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