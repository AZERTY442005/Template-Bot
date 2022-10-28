const { PassThrough } = require("stream");
//
try {
    const Discord = require("discord.js");
    const fs = require('fs')
    const {token, OwnerID, CreatorID, BotInfo, redisPath} = require("./config.json")
    const { MessageEmbed } = require("discord.js");
    require('discord-reply');
    const {format: prettyFormat} = require('pretty-format');
    const fetch = require('node-fetch');

    require("dotenv").config()
    

    const bot = new Discord.Client({
        intents: ["GUILDS"],
    })
    bot.commands = new Discord.Collection()



    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
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
        const Guilds_name = bot.guilds.cache.map(guild => guild.name);
        const Guilds_id = bot.guilds.cache.map(guild => guild.id);
        let guilds_list = ""
        for (const guild in Guilds_name) {
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




        console.log("Connected")
        console.log(`\n🛠 ${BotInfo["name"]} has started 🛠`);
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
    });


    // Message Reaction Events
    bot.on("messageReactionAdd", function(messageReaction, user){
    });
    bot.on("messageReactionRemove", function(messageReaction, user){
    });


    bot.on("messageUpdate", function(oldMessage, newMessage){ // Message Edited
    });





    bot.on('guildCreate', guild => {
        const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
        channel.send("Thanks for inviting me")
    })


    bot.on("guildMemberAdd", member => {
        let join_message_status = JSON.parse(fs.readFileSync("./DataBase/join-message-status.json", "utf8"))
        let join_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/join-message-channel-id.json", "utf8"))
        if(join_message_status[member.guild.id].join_message_status == "on") {
            const join_message = `Welcome <@${member.id}> to the server`
            const channel = member.guild.channels.cache.get(join_message_channel_id[member.guild.id].join_message_channel_id)
            channel.send(join_message)
        }
    });

    bot.on("guildMemberRemove", member => {
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




    for (const file of commandFiles) { // Get Commands
        const command = require(`./commands/${file}`);
        bot.commands.set(command.name, command);
    }

    if(fs.readFileSync("./DataBase/beta", "utf8")=="on") {
        for (const file of commandFiles_BETA) {
            const command = require(`./commands/BETA/${file}`);
            bot.commands.set(command.name, command);
        }
        for (const file of commandFiles_hidden) {
            const command = require(`./commands/hidden/${file}`);
            bot.commands.set(command.name, command);
        }
    }


    const talkedRecently = new Set();
    const commandedRecently = new Set();

    bot.on("message", message => { // Message Event
        if(message.author.bot) return;
        if(message.guild == null) {
            message.author.send("Désolé, je ne suis pas compatible avec les messages privées")
            return;
        }
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
                levels_requirments.push(Math.floor(temp))
                temp = temp * 1.5
            }

            if (!talkedRecently.has(message.author.id) && xp_system["status"][message.guild.id]=="on") { // MESSAGE XP COOLDOWN
                xp_system["messages"][message.guild.id][message.author.id] = xp_system["messages"][message.guild.id][message.author.id] + 1
                xp_system["total-messages"][message.guild.id][message.author.id] = xp_system["total-messages"][message.guild.id][message.author.id] + 1

                talkedRecently.add(message.author.id);
                setTimeout(() => {
                // Removes the user from the set after a minute
                talkedRecently.delete(message.author.id);
                }, 2000);}
            if(xp_system["messages"][message.guild.id][message.author.id] >= levels_requirments[xp_system["levels"][message.guild.id][message.author.id]] && xp_system["levels"][message.guild.id][message.author.id] < 10) {
                xp_system["levels"][message.guild.id][message.author.id] = xp_system["levels"][message.guild.id][message.author.id] + 1
                xp_system["messages"][message.guild.id][message.author.id] = 0
                if(xp_system["levels"][message.guild.id][message.author.id]!=10) {
                    message.channel.send(`GG ${message.author}, tu es passé au **niveau ${xp_system["levels"][message.guild.id][message.author.id]}** !!!\nIl te faut maintenant écrire **${levels_requirments[xp_system["levels"][message.guild.id][message.author.id]]} messages**`)
                } else {
                    message.channel.send(`GG ${message.author}, tu es passé au **niveau ${xp_system["levels"][message.guild.id][message.author.id]}** !!! ** Niveau MAX**`)
                }
            }
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
                UserWarns = parseInt(warns[message.guild.id][message.author.id].warns)
                const ReasonWarn = `Bad words: ${message.content}`
                let AvatarWarn = message.author.displayAvatarURL()
                let EmbedWarn = new MessageEmbed()
                            .setTitle(`WARN`)
                            .setDescription(``)
                            .setColor("ORANGE")
                            .setThumbnail(AvatarWarn)
                            .addFields(
                                {name:"Mod Name",value:`<@${BotInfo["ID"]}>`,inline:true},
                                {name:"Warned Name",value:`<@${message.author.id}>`,inline:true},
                                {name:"Reason",value:`${ReasonWarn}`,inline:true},
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