const fs = require('fs')
const {format: prettyFormat} = require('pretty-format');
const { MessageEmbed, WebhookClient } = require('discord.js');
const fetch = require('node-fetch');
const { PassThrough } = require('stream');


module.exports = {
    name: 'test',
    description: "Permet de tester une commande test",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            // if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("ERREUR: Vous n'avez pas la permission de faire ceci!")
            if(message.author.id != config["CreatorID"]) return
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
                    time: 5000,
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
                function getChannelIdFromMention(mention) {
                    if (!mention) return;

                    if (mention.startsWith('<#') && mention.endsWith('>')) {
                        mention = mention.slice(2, -1);
                        
                
                        if (mention.startsWith('!')) {
                            mention = mention.slice(1);
                        }

                        return mention;
                    }
                }
                console.log(getChannelIdFromMention(args[1]))
                console.log(message.mentions.members.first())
            }
            // if(args[0] == "isnumber") {
            //     console.log(isNaN(args[1]))
            // }
            // if(args[0] == "floor") {
            //     console.log(Math.floor(Number(args[1])))
            // }
            if(args[0] == "webhook-create") {
                message.channel.createWebhook('Some-username', {
                    avatar: 'https://i.imgur.com/AfFp7pu.png',
                })
                    .then(webhook => {
                        console.log(`Created webhook ${prettyFormat(webhook)}`)

                        webhook.edit({
                            name: 'Some-username',
                            avatar: 'https://i.imgur.com/AfFp7pu.png',
                            channel: '933667806728314901',
                        })
                            .then(webhook => console.log(`Edited webhook ${webhook.id}: ${webhook.token}`))
                            .catch(console.error);
                    })
                    .catch(console.error);
                
            }
            if(args[0] == "webhook-send") {
                // const webhookClient = new WebhookClient({ id: "934152348278853682", token: "BRanJz_g7usyQqCnHqzZJMoVH6HVPM6-SmyZTkiMle2yEcLLEZmc4EmNmdPrKbYCajCF" });
                const webhookClient = new WebhookClient({ url:"https://discord.com/api/webhooks/934154283128094782/gm3uk8kepcz4pLR5ebL9jSJZphWPzXGInzKiEApMctbZkrO0JEap5LJT0V8R-uEqliuJ"});

                // console.log(webhookClient)
                // console.log(prettyFormat(webhookClient))

                var URL = `https://discord.com/api/webhooks/934154283128094782/gm3uk8kepcz4pLR5ebL9jSJZphWPzXGInzKiEApMctbZkrO0JEap5LJT0V8R-uEqliuJ`;

                // fetch(URL, {
                //     "method":"POST",
                //     "headers": {"Content-Type": "application/json"},
                //     "body": JSON.stringify({
                //        "content":"test",
                //        "username": "COUCOU"
                //     })
                // })
                // .then(res=> console.log(prettyFormat(res)))
                // .catch(err => console.error(prettyFormat(err)));
                
                fetch(URL, {
                    "method":"POST",
                    "headers": {"Content-Type": "application/json"},
                    "body": JSON.stringify(
                        {
                            "username": "Webhook",
                            "avatar_url": "https://i.imgur.com/4M34hi2.png",
                            "content": "Text message. Up to 2000 characters.",
                            "embeds": [
                            {
                                "author": {
                                "name": "Birdie♫",
                                "url": "https://www.reddit.com/r/cats/",
                                "icon_url": "https://i.imgur.com/R66g1Pe.jpg"
                                },
                                "title": "Title",
                                "url": "https://google.com/",
                                "description": "Text message. You can use Markdown here. *Italic* **bold** __underline__ ~~strikeout~~ [hyperlink](https://google.com) `code`",
                                "color": 15258703,
                                "fields": [
                                {
                                    "name": "Text",
                                    "value": "More text",
                                    "inline": true
                                },
                                {
                                    "name": "Even more text",
                                    "value": "Yup",
                                    "inline": true
                                },
                                {
                                    "name": "Use `\"inline\": true` parameter, if you want to display fields in the same line.",
                                    "value": "okay..."
                                },
                                {
                                    "name": "Thanks!",
                                    "value": "You're welcome :wink:"
                                }
                                ],
                                "thumbnail": {
                                "url": "https://upload.wikimedia.org/wikipedia/commons/3/38/4-Nature-Wallpapers-2014-1_ukaavUI.jpg"
                                },
                                "image": {
                                "url": "https://upload.wikimedia.org/wikipedia/commons/5/5a/A_picture_from_China_every_day_108.jpg"
                                },
                                "footer": {
                                "text": "Woah! So cool! :smirk:",
                                "icon_url": "https://i.imgur.com/fKL31aD.jpg"
                                }
                            }
                            ]
                        }
                    )
                })
                .then(res=> console.log(prettyFormat(res)))
                .catch(err => console.error(prettyFormat(err)));

                // const embed = new MessageEmbed()
                // .setTitle('Some Title')
                // .setColor('#0099ff');
                // webhookClient.send({
                //     "body":{
                //     "content": 'Webhook test',
                //     "username": 'Some-username',
                //     "avatarURL": 'https://i.imgur.com/AfFp7pu.png',
                //     "embeds": [embed]}
                // });
                
                // webhookClient.send("HELLO THERE")

                // (async () => {
                //     try {
                //         await hook.send('Hello there!');
                //         console.log('Successfully sent webhook!');
                //     }
                //     catch(e){
                //         console.log(e.message);
                //     };
                // })();

                // const embed = new MessageEmbed()
                // .setTitle('Some Title')
                // .setDescription("Webhook test")
                // .setThumbnail("https://i.imgur.com/AfFp7pu.png")
                // .setColor('#0099ff');
                // webhookClient.send(embed)
                // .catch(error => {
                //     console.error(error)
                // })
            }
            if(args[0] == "botperm") {
                if(message.guild.me.hasPermission("MUTE_MEMBERS"))
                    console.log("I can mute members!!")
                else
                    console.log("I CAN'T mute members!")
            }
            if(args[0] == "userperm") {
                // message.channel.replacePermissionOverwrites({
                //     "overwrites": message.channel.permissionOverwrites.filter(o => o.id !== "692655950426800169")
                // });
            }
            if(args[0] == "invite") {
                message.guild.channels.cache.get(message.channel.id).createInvite().then(invite =>
                    message.channel.send(invite.url)
                );
            }
            // if(args[0] == "help") {
            //     console.log(prettyFormat(bot.commands))
            //     // for (const command in Array.from(bot.commands.values())) {
            //     //     console.log(Array.from(bot.commands.values())[command]["description"])
            //     // }
            // }
            // if(args[0] == "count") {
                // console.log(message.guild.members.size)
                // var memberCount = message.guild.members.filter(member => !member.user.bot).size
                // console.log(memberCount)
                // console.log(Array.from(message.guild.members))
            // }
            if(args[0] == "idsend") {
                bot.users.get("452454205056352266").send("someMessage");
                bot.users.cache.get("452454205056352266").send("someMessage");
                user = bot.users.fetch("452454205056352266").catch(() => null);
                message.user.send("qlksjudgvk")
                user = bot.users.cache.find(user => user.id === "452454205056352266")
                user = bot.get_user("452454205056352266")
                message.user.send("qlksjudgvk")
                const user = bot.users.cache.fetch(452454205056352266);
                user.send();
            }
        } catch (error) { // ERROR PREVENTER
            console.error(`${error}`)
            message.lineReply(`Une erreur est survenue`)
            var URL = fs.readFileSync("./DataBase/webhook-logs-url", "utf8")
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