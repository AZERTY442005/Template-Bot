const { PassThrough } = require("stream");

try {
    const Discord = require("discord.js");
    // const {executionAsyncResource} = require("async_hooks");
    // const { createCipher } = require("crypto");
    const fs = require('fs')
    const {token, OwnerID, CreatorID, BotInfo, redisPath} = require("./config.json")
    const { MessageEmbed } = require("discord.js");
    require('discord-reply');
    const {format: prettyFormat} = require('pretty-format');
    const fetch = require('node-fetch');
    // const redis = require("redis")
    // ZYMN1LgW4PTYTnToZB5WMgvCHvMLX4w6
    // redis-14402.c10.us-east-1-4.ec2.cloud.redislabs.com:14402

    require("dotenv").config()
    

    const bot = new Discord.Client({
        intents: ["GUILDS"],
    })
    bot.commands = new Discord.Collection()


    // let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
    // bot.prefixes = new Discord.Collection()
    // for(const prefix in prefixes) {
    //     console.log("Prefix: "+prefix+" : "+prefix.prefixes)
    //     bot.prefixes.set(prefix)
    // }

    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
    const commandFiles_AzerDev = fs.readdirSync('./commands/AzerDev').filter(file => file.endsWith('.js'))
    const commandFiles_BETA = fs.readdirSync('./commands/BETA').filter(file => file.endsWith('.js'))
    const commandFiles_hidden = fs.readdirSync('./commands/hidden').filter(file => file.endsWith('.js'))

    const commands_list = { // Expected Commands List
        "announce.js": "❌",
        "avatar.js": "❌",
        "ban.js": "❌",
        "blacklist.js": "❌",
        "bruh.js": "❌",
        "8ball.js": "❌",
        "clear.js": "❌",
        "credits.js": "❌",
        "commands.js": "❌",
        "dm.js": "❌",
        "easter-egg.js": "❌",
        "embed.js": "❌",
        "ghostping.js": "❌",
        "help.js": "❌",
        "hey.js": "❌",
        "invite.js": "❌",
        "kick.js": "❌",
        "logs.js": "❌",
        "love.js": "❌",
        // "mute.js": "❌",
        "ping.js": "❌",
        "pub.js": "❌",
        "rules.js": "❌",
        "poll.js": "❌",
        "prefix.js": "❌",
        // "reactionrole.js": "❌",
        "report.js": "❌",
        // "rolereaction.js": "❌",
        // "role.js": "❌",
        "roll.js": "❌",
        "say.js": "❌",
        "serverinfo.js": "❌",
        "settings.js": "❌",
        "shutdown.js": "❌",
        "slowmode.js": "❌",
        // "suggest.js": "❌",
        "test.js": "❌",
        "unban.js": "❌",
        // "uptime.js": "❌",
        "userinfo.js": "❌",
        "warn.js": "❌",
        "warns.js": "❌",
    }
    for(const i of commandFiles) {
        if(i in commands_list) {
            commands_list[i] = "✅"
        }
    }
    const ListCommands = false       // Enable Here ListCommands Mode
    for(const i of Object.keys(commands_list)) {
        if(ListCommands) console.log(commands_list[i]+" "+i)
    }


    const badwords = [ // Badwords LIST
        "fdp",
        "merde",
        "ptn",
        "tg",
        "bite",
        "ntm",
        "enculé",
        "encule",
        "putain",
        "nique",
        "pute",
        "gueule",
        "batard",
        "fuck",
        "fck",
    ]

    const autoreacts = { // Auto-react LIST
        "hey": "👋",
        "salut": "👋",
        "slt": "👋",
        "cc": "👋",
        "mdr": "😂",
    }

    console.log("Connecting...")
    bot.on("ready", () => { // BOT READY
        // bot.user.setActivity("Exemple de Bot");
        // const channellogs = bot.channels.cache.find(channel => channel.name === "logs-templatebot"); //Here you put the logs channelName
        // if(!channellogs) return message.channel.send("ERREUR; Il n'y a pas de salon nommé logs-azerbot existant")
        // channellogs.send("------------------------\n**Template Bot has started**\n------------------------");
        const Guilds_name = bot.guilds.cache.map(guild => guild.name);
        const Guilds_id = bot.guilds.cache.map(guild => guild.id);
        // console.log(prettyFormat(Guilds_id))
        let guilds_list = ""
        for (const guild in Guilds_name) {
            // console.log(Guilds_id[guild])
            guilds_list=guilds_list+`${Guilds_name[guild]}: ${Guilds_id[guild]}\n`
        }
        guilds_list=guilds_list.slice(0, -1)

        let user_count = 0
        bot.guilds.cache.map(guild => {
            user_count = user_count + guild.memberCount
        });
        

        var URL = fs.readFileSync("./DataBase/webhook-logs-url", "utf8")
        fetch(URL, {
            "method":"POST",
            "headers": {"Content-Type": "application/json"},
            "body": JSON.stringify(
                {
                    "username": `${BotInfo["name"]} Logs`,
                    "avatar_url": `${BotInfo["IconURL"]}`,
                    "embeds": [
                      {
                        "title": "__Started__",
                        // "description": "Text message. You can use Markdown here. *Italic* **bold** __underline__ ~~strikeout~~ [hyperlink](https://google.com) `code`",
                        "color": 1173539,
                        "author": {
                          "name": `${BotInfo["name"]}`,
                          "icon_url": `${BotInfo["IconURL"]}`,
                        },
                        "fields": [
                            {
                            "name": `Servers (${Guilds_name.length})`,
                            "value": `${guilds_list}`,
                            "inline": false
                            },
                            {
                            "name": `Users (${user_count})`,
                            "value": "(Users)",
                            "inline": false
                            }
                        ],
                      }
                    ]
                }
            )
        })
        .catch(err => PassThrough);

        // {
        //     "username": `${BotInfo["name"]} Logs`,
        //     "content":"Started"
        // }



        console.log("Connected")
        console.log(`\n🛠 ${BotInfo["name"]} has started 🛠`);
        // console.log(`with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`); 
    //    bot.user.setActivity("se faire configurer", {type: "PLAYING"});
        // console.log("BOT ID: "+bot.user.id)
        
        // for(let i=0;i<Guilds.length;i++) {
        //     console.log(Guilds[i])
        // }
    });


    const DEBUG = false     // Enable Here DEBUG Mode
    bot.on("debug", function(info){ // DEBUG EVENT
        if(DEBUG) console.log(`debug -> ${info}`);
    });
    bot.on("disconnect", function(event){
        console.log(`The WebSocket has closed and will no longer attempt to reconnect`);
    });
    bot.on("error", function(error){
        console.error(`client's WebSocket encountered a connection error: ${error}`);
    });


    bot.on("messageDelete", function(message){ // Deleted Message Event
        // console.log(`message is deleted -> ${message.content}`);
    });


    // Message Reaction Events
    bot.on("messageReactionAdd", function(messageReaction, user){
        // console.log(`a reaction is added to a message:\nmessage: ${messageReaction.content}\nUserID: ${user.id}`);
    });
    bot.on("messageReactionRemove", function(messageReaction, user){
        // console.log(`a reaction is removed from a message`);
    });


    bot.on("messageUpdate", function(oldMessage, newMessage){ // Message Edited
        // console.log(`A message is updated: "${oldMessage.content}" ---> "${newMessage.content}"`);
    });





    bot.on('guildCreate', guild => {
        const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
        channel.send("Thanks for inviting me")
    })

    // bot.on('guildMemberAdd', member => {
    //     member.send("Welcome!");
    //     console.log("Welcome")
    // });

    bot.on("guildMemberAdd", member => {
        // console.log("Member joined :", member)
        let join_message_status = JSON.parse(fs.readFileSync("./DataBase/join-message-status.json", "utf8"))
        let join_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/join-message-channel-id.json", "utf8"))
        if(join_message_status[member.guild.id].join_message_status == "on") {
            const join_message = `Welcome <@${member.id}> to the server`
            const channel = member.guild.channels.cache.get(join_message_channel_id[member.guild.id].join_message_channel_id)
            channel.send(join_message)
        }
        // var role = member.guild.roles.find("name", "member");
        // member.addRole(role);
    });

    bot.on("guildMemberRemove", member => {
        // console.log("Member as left :", member)
        let leave_message_status = JSON.parse(fs.readFileSync("./DataBase/leave-message-status.json", "utf8"))
        let leave_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/leave-message-channel-id.json", "utf8"))
        if(!leave_message_status[member.guild.id]) {
            leave_message_status[member.guild.id] = {
                leave_message_status: "off"
            }
            fs.writeFile("./DataBase/leave-message-status.json", JSON.stringify(leave_message_status), (err) => {
                if (err) console.error();
            });
        }
        if(leave_message_status[member.guild.id].leave_message_status == "on") {
            const leave_message = `Bye <@${member.id}>`
            const channel = member.guild.channels.cache.get(leave_message_channel_id[member.guild.id].leave_message_channel_id)
            channel.send(leave_message)
        }
    });



    // console.log( "\u001b[1;31m Red message" );
    // console.log( "\u001b[1;32m Green message" );
    // console.log( "\u001b[1;33m Yellow message" );
    // console.log( "\u001b[1;34m Blue message" );
    // console.log( "\u001b[1;35m Purple message" );
    // console.log( "\u001b[1;36m Cyan message" );

    // console.log( "\u001b[1;41m Red background" );
    // console.log( "\u001b[1;42m Green background" );
    // console.log( "\u001b[1;43m Yellow background" );
    // console.log( "\u001b[1;44m Blue background" );
    // console.log( "\u001b[1;45m Purple background" );
    // console.log( "\u001b[1;46m Cyan background" );
    // console.log("salut")
    // console.log( "\u001b[0m Reset text and background color/style to default" );
    // console.log( "\u001b[1;31m --process: Error" + "\u001b[0m" );
    // console.log('\u001b[' + 32 + 'm' + 'hello stack' + '\u001b[0m')

    // const DEFAULT_THEME = {
    //     comment: 'gray',
    //     content: 'reset',
    //     prop: 'yellow',
    //     tag: 'cyan',
    //     value: 'green',
    //   };

    // console.log(commandFiles[0].substring(0, commandFiles.length - 3))
    // for(const command in commandFiles) {
    //     console.log(command.substring(0, command.length - 3))
    // }

    for (const file of commandFiles) { // Get Commands
        const command = require(`./commands/${file}`);
        bot.commands.set(command.name, command);
    }
    // console.log(prettyFormat(bot.commands))
    // console.log(prettyFormat(bot.commands)[0])
    // console.log(bot.commands.keys())
    // console.log(prettyFormat(Array.from(bot.commands.values())))
    // for (const command in Array.from(bot.commands.values())) {
    //     console.log(Array.from(bot.commands.values())[command]["description"])
    // }

    if(fs.readFileSync("./DataBase/beta", "utf8")=="on") {
        for (const file of commandFiles_AzerDev) {
            const command = require(`./commands/AzerDev/${file}`);
            bot.commands.set(command.name, command);
        }
        for (const file of commandFiles_BETA) {
            const command = require(`./commands/BETA/${file}`);
            bot.commands.set(command.name, command);
        }
        for (const file of commandFiles_hidden) {
            const command = require(`./commands/hidden/${file}`);
            bot.commands.set(command.name, command);
        }
    }

    // for(const command_temp in bot.commands) {
    //     console.log(typeof command_temp)
    // }

    const talkedRecently = new Set();
    const commandedRecently = new Set();

    bot.on("message", message => { // Message Event
        // let DATAS = JSON.parse(fs.readFileSync("./DataBase/DATAS.json", "utf8")); // DATAS SETUP
        if(message.author.bot) return;
        if(message.guild == null) {
            // console.log("TEST2")
            // message.reply("Salut, je ne suis pas compatible avec les messages privées")
            message.author.send("Désolé, je ne suis pas compatible avec les messages privées")
            return;
        }
        // if(message.channel.type == "") {
        //     console.log("TEST1")
        //     return;
        // }
        if(message.channel.type == "dm"||message.channel.type==="group") return;
        if(message.channel == null) return;
        
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));

        let join_message_status = JSON.parse(fs.readFileSync("./DataBase/join-message-status.json", "utf8"))
        if(!join_message_status[message.guild.id]) { // If join_message_status is not defined for the server
            join_message_status[message.guild.id] = {
                join_message_status: "off",
            }
            fs.writeFile("./DataBase/join-message-status.json", JSON.stringify(join_message_status), (err) => {
                if (err) console.error();
            })
        }



        if(!prefixes[message.guild.id]) { // If prefix is not defined for the server
            prefixes[message.guild.id] = {
                prefixes: "/",
            }
            fs.writeFile("./DataBase/prefixes.json", JSON.stringify(prefixes), (err) => {
                if (err) console.error();
            })
        }

        const prefix = prefixes[message.guild.id].prefixes;

        const args = message.content.slice(prefix.length).trim().split(/ +/)
        const command = args.shift().toLowerCase().slice(message.length - prefix.length)

        if(fs.readFileSync("./DataBase/status", "utf8")=="off" && command!="owner") return

        let UserMention = message.mentions.users.first();
        if (UserMention!=null && UserMention.id==BotInfo["ID"]) { // If the bot is mentioned
            message.channel.send(`Oui c'est moi ? Pour information mon préfix est **${prefix}**`)
        }


        if(message.content.startsWith(prefix)){ // Command detected
            // if(!DATAS["commands"]) DATAS["commands"]=0
            // DATAS["commands"] = DATAS["commands"] + 1
            // fs.writeFile("./DataBase/DATAS.json", JSON.stringify(DATAS), (err) => {
            //     if (err) console.error();
            // });
            let blacklist = JSON.parse(fs.readFileSync("./DataBase/blacklist.json", "utf8"));
            if(blacklist.includes(message.author.id)) {
                message.delete()
                message.author.send(`Oups!!! On dirait que tu as été blacklisté, tu ne peux donc pas utiliser mes commandes.\nSi tu penses que c'est une erreur, contacte mon développeur.`)
                return
            }

            if (commandedRecently.has(message.author.id) && !message.member.hasPermission("ADMINISTRATOR")) { // Command Cooldown
                message.lineReply("Veuillez attendre 3 secondes entre chaques commandes");
            } else {
                if(!bot.commands.has(command)) return // message.lineReply("Erreur: Cette commande n'existe pas");

            // const channellogs = bot.channels.cache.find(channel => channel.name === "logs-templatebot"); //Here you put the logs channelName
            // channellogs.send(`__${message.author.username}__ *from ${message.guild.name}*` + " :\n" + command + " " + argsresult + "\n----------------------------------------");
            argsresult = args.join(" ");
            var URL = fs.readFileSync("./DataBase/webhook-logs-url", "utf8") // Webhook Logs System
            fetch(URL, {
                "method":"POST",
                "headers": {"Content-Type": "application/json"},
                "body": JSON.stringify(
                    {
                        "username": `${BotInfo["name"]} Logs`,
                        "avatar_url": `${BotInfo["IconURL"]}`,
                        "embeds": [
                        {
                            "title": "__Command executed__",
                            "color": 15258703,
                            "author": {
                              "name": `${message.author.username}`,
                              "icon_url": `${message.author.displayAvatarURL()}`,
                            },
                            "fields": [
                                {
                                    "name": "User",
                                    "value": `${message.author}`,
                                    "inline": false
                                },
                                {
                                    "name": "Server",
                                    "value": `${message.guild.name}`,
                                    "inline": false
                                },
                                {
                                    "name": "Command",
                                    "value": `${prefix}${command} ${argsresult}`,
                                    "inline": false
                                }
                            ],
                        }
                        ]
                    }
                )
            })
            .catch(err => PassThrough);

                // console.log("COMMAND PREFIX: '"+prefix+"'") //TEST
                // console.log("COMMAND TOKEN: '"+token+"'") //TEST
                if(!message.guild.me.hasPermission("ADMINISTRATOR")) return message.lineReply(`Je ne possède pas les permissions d'Administrateur\nPour profiter des fonctionnalitées, veuillez les activer`)

                bot.commands.get(command).execute(message, args, Discord.Guild, BotInfo, token, prefix, prefixes, bot, bot.prefix, bot.user.id)


                // Adds the user to the set so that they can't talk for a minute
                commandedRecently.add(message.author.id);
                setTimeout(() => {
                // Removes the user from the set after a minute
                commandedRecently.delete(message.author.id);
                }, 3000);
            }
        } else {
            // if(!DATAS["messages"]) DATAS["messages"]=0
            // DATAS["messages"] = DATAS["messages"] + 1
            // fs.writeFile("./DataBase/DATAS.json", JSON.stringify(DATAS), (err) => {
            //     if (err) console.error();
            // });

            // XP SYSTEM
            let xp_system = JSON.parse(fs.readFileSync("./DataBase/xp-system.json", "utf8"))
            if(!xp_system["status"]) xp_system["status"] = {}
            if(!xp_system["status"][message.guild.id]) {
                xp_system["status"][message.guild.id] = "on"
            }
            if(!xp_system["messages"]) xp_system["messages"] = {}
            if(!xp_system["messages"][message.guild.id]) xp_system["messages"][message.guild.id] = {}
            if(!xp_system["messages"][message.guild.id][message.author.id]) {
                xp_system["messages"][message.guild.id][message.author.id] = 0
            }
            if(!xp_system["levels"]) xp_system["levels"] = {}
            if(!xp_system["levels"][message.guild.id]) xp_system["levels"][message.guild.id] = {}
            if(!xp_system["levels"][message.guild.id][message.author.id]) {
                xp_system["levels"][message.guild.id][message.author.id] = 0
            }
            if(!xp_system["total-messages"]) xp_system["total-messages"] = {}
            if(!xp_system["total-messages"][message.guild.id]) xp_system["total-messages"][message.guild.id] = {}
            if(!xp_system["total-messages"][message.guild.id][message.author.id]) {
                xp_system["total-messages"][message.guild.id][message.author.id] = 0
            }

            var times = 10;
            let temp = 10
            let levels_requirments = []
            for(var i = 0; i < times; i++){ // GET LEVELS REQUIRMENTS
                // console.log("temp: "+temp)
                levels_requirments.push(Math.floor(temp))
                temp = temp * 1.5
            }
            // console.log("LIST: "+levels_requirments)

            // console.log("test: "+prettyFormat(xp_system["messages"][message.guild.id][message.author.id]))
            if (!talkedRecently.has(message.author.id) && xp_system["status"][message.guild.id]=="on") { // MESSAGE XP COOLDOWN
                xp_system["messages"][message.guild.id][message.author.id] = xp_system["messages"][message.guild.id][message.author.id] + 1
                xp_system["total-messages"][message.guild.id][message.author.id] = xp_system["total-messages"][message.guild.id][message.author.id] + 1

                talkedRecently.add(message.author.id);
                setTimeout(() => {
                // Removes the user from the set after a minute
                talkedRecently.delete(message.author.id);
                }, 2000);}
            // xp_system["messages"][message.guild.id][message.author.id] = xp_system["messages"][message.guild.id][message.author.id] + 1
            // xp_system["total-messages"][message.guild.id][message.author.id] = xp_system["total-messages"][message.guild.id][message.author.id] + 1
            // console.log("messages: "+xp_system["messages"][message.guild.id][message.author.id])
            // console.log("levels: "+xp_system["levels"][message.guild.id][message.author.id])
            if(xp_system["messages"][message.guild.id][message.author.id] >= levels_requirments[xp_system["levels"][message.guild.id][message.author.id]] && xp_system["levels"][message.guild.id][message.author.id] < 10) {
                xp_system["levels"][message.guild.id][message.author.id] = xp_system["levels"][message.guild.id][message.author.id] + 1
                xp_system["messages"][message.guild.id][message.author.id] = 0
                if(xp_system["levels"][message.guild.id][message.author.id]!=10) {
                    message.channel.send(`GG ${message.author}, tu es passé au **niveau ${xp_system["levels"][message.guild.id][message.author.id]}** !!!\nIl te faut maintenant écrire **${levels_requirments[xp_system["levels"][message.guild.id][message.author.id]]} messages**`)
                } else {
                    message.channel.send(`GG ${message.author}, tu es passé au **niveau ${xp_system["levels"][message.guild.id][message.author.id]}** !!! ** Niveau MAX**`)
                }
            }
            // fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system), (err) => {
            fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system, null, 4), (err) => {
                if (err) console.error();
            });


            // AUTO-REACT SYSTEM
            let auto_react = JSON.parse(fs.readFileSync("./DataBase/auto-react.json", "utf8"))
            if(!auto_react[message.guild.id]) {
                auto_react[message.guild.id] = {
                    auto_react: "off"
                }
                fs.writeFile("./DataBase/auto-react.json", JSON.stringify(auto_react), (err) => {
                    if (err) console.error();
                });
            }
            if(auto_react[message.guild.id].auto_react!="on") return
            if(message.content in autoreacts){
                message.react(autoreacts[message.content])
            }
        }



        if(!message.member.hasPermission("ADMINISTRATOR")) { // Badwords detector
            let confirm = false
            var i;
            for(i = 0;i < badwords.length; i++) {
                if(message.content.toLowerCase().includes(badwords[i].toLowerCase()))
                    confirm = true
                    const word = badwords[i]
            }
            if(confirm) {
                let warns = JSON.parse(fs.readFileSync("./DataBase/warns.json", "utf8"));
                if(!warns[message.guild.id]) warns[message.guild.id]={}
                if(!warns[message.guild.id][message.author.id]) {
                    warns[message.guild.id][message.author.id] = {
                        warns: 0,
                    }
                    fs.writeFile("./DataBase/warns.json", JSON.stringify(warns), (err) => {
                        if (err) console.error();
                    })
                }
                message.delete().catch(error => {
                    console.error("Badwords Deletion: "+error)
                })
                // let UserWarn = message.author.id
                UserWarns = parseInt(warns[message.guild.id][message.author.id].warns)
                const ReasonWarn = `Bad words: ${message.content}`
                let AvatarWarn = message.author.displayAvatarURL()
                //let ChannelWarn = message.guild.channels.cache.find(channel => channel.name === "warns")
                let EmbedWarn = new MessageEmbed()
                            .setTitle(`WARN`)
                            .setDescription(``)
                            .setColor("ORANGE")
                            .setThumbnail(AvatarWarn)
                            .addFields(
                                {name:"Mod Name",value:`<@${BotInfo["ID"]}>`,inline:true},
                                {name:"Warned Name",value:`<@${message.author.id}>`,inline:true},
                                {name:"Reason",value:`${ReasonWarn}`,inline:true},
                                // {name:"Mod ID",value:`${BotInfo["ID"]}`,inline:true},
                                // {name:"Warned ID",value:`${message.author.id}`,inline:true},
                                {name:"Date (M/D/Y)",value:`${new Intl.DateTimeFormat("en-US").format(Date.now())}`,inline:true}
                            )
                            .setTimestamp()
                            message.channel.send(EmbedWarn)
                            warns[message.guild.id][message.author.id] = {
                                warns: UserWarns + 1,
                            }
                            fs.writeFile("./DataBase/warns.json", JSON.stringify(warns), (err) => {
                                if (err) console.error();
                            })
            }
        }
    });

    bot.login(token)
    .catch(error => {
        console.error("Unable to connect the Bot to internet:\n"+error)
    })
} catch (error) {
    console.error(error)
}