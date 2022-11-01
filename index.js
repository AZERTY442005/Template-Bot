// Importations
const { PassThrough } = require("stream");
const Discord = require("discord.js");
const fs = require('fs')
const {token, BotInfo} = require("./config.json")
const { MessageEmbed } = require("discord.js");
require('discord-reply');
const {format: prettyFormat} = require('pretty-format');
const fetch = require('node-fetch');
require("dotenv").config()
const bot = new Discord.Client({
    intents: ["GUILDS"],
    partials: ["MESSAGE", "CHANNEL", "REACTION"]
})
bot.commands = new Discord.Collection()
bot.helpcommands = new Discord.Collection()
console.log("Connecting...")


// const { UserError } = require("./UserError.js")


// GET COMMANDS
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'))
const commandFiles_AzerDev = fs.readdirSync('./commands/AzerDev').filter(file => file.endsWith('.js'))
const commandFiles_BETA = fs.readdirSync('./commands/BETA').filter(file => file.endsWith('.js'))
const commandFiles_hidden = fs.readdirSync('./commands/hidden').filter(file => file.endsWith('.js'))
for (const file of commandFiles) { // Get Commands
    const command = require(`./commands/${file}`);
    bot.commands.set(command.name, command);
    bot.helpcommands.set(command.name, command);
}
if(fs.readFileSync("./DataBase/beta.txt", "utf8")=="on") { // Read Command Dirs
    for (const file of commandFiles_BETA) {
        const command = require(`./commands/BETA/${file}`);
        bot.commands.set(command.name, command);
    }
}
for (const file of commandFiles_hidden) {
    const command = require(`./commands/hidden/${file}`);
    bot.commands.set(command.name, command);
}
for (const file of commandFiles_AzerDev) {
    const command = require(`./commands/AzerDev/${file}`);
    bot.commands.set(command.name, command, "AzerDev");
}



// COMMANDS LIST
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
for(const i of commandFiles) { // Check Each Commands
    if(i in commands_list) {
        commands_list[i] = "✅"
    }
}
const ListCommands = false       // Enable Here ListCommands Mode
for(const i of Object.keys(commands_list)) {
    if(ListCommands) console.log(commands_list[i]+" "+i)
}



// GET EVENTS
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
const eventFiles_message = fs.readdirSync('./events/message').filter(file => file.endsWith('.js'));
for (const file of eventFiles) { // Read Events
	const event = require(`./events/${file}`);
	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args, bot));
	} else {
		bot.on(event.name, (...args) => event.execute(...args, bot));
	}
}
for (const file of eventFiles_message) { // Read Message Events
	const event = require(`./events/message/${file}`);
	if (event.once) {
		bot.once(event.name, (...args) => event.execute(...args, bot));
	} else {
		bot.on(event.name, (...args) => event.execute(...args, bot));
	}
}



// CREATING VARS
const commandedRecently = new Set();



// MESSAGE EVENT
bot.on("message", message => { // Message Event
    // let DATAS = JSON.parse(fs.readFileSync("./DataBase/DATAS.json", "utf8")); // DATAS SETUP
    // console.log(bot.guilds.cache)
    // RETURN IF PRIVATE MESSAGE
    if(message.author.bot) return;
    if(message.guild == null) {
        message.author.send(":flag_fr: Désolé, je ne suis pas compatible avec les messages privés\n:flag_gb: Sorry, I'm not compatible with private messages")
        return;
    }
    if(message.channel.type == "dm"||message.channel.type==="group") return;
    if(message.channel == null) return;
    

    
    // SETUP JOIN-MESSAGE
    let join_message_status = JSON.parse(fs.readFileSync("./DataBase/join-message-status.json", "utf8"))
    if(!join_message_status[message.guild.id]) { // If join_message_status is not defined for the server
        join_message_status[message.guild.id] = {
            join_message_status: "off",
        }
        fs.writeFile("./DataBase/join-message-status.json", JSON.stringify(join_message_status), (err) => {
            if (err) console.error();
        })
    }


    // VAR PREFIXES
    let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
    if(!prefixes[message.guild.id]) { // If prefix is not defined for the server
        prefixes[message.guild.id] = {
            prefixes: `${JSON.parse(fs.readFileSync("./config.json", "utf8"))["DefaultPrefix"]}`,
        }
        fs.writeFile("./DataBase/prefixes.json", JSON.stringify(prefixes), (err) => {
            if (err) console.error();
        })
    }
    const prefix = prefixes[message.guild.id].prefixes;

    // VAR LANGUAGES
    let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
    let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"));
    if(!languages[message.guild.id]) {
        languages[message.guild.id] = "en"
    }

    // VAR COMMAND & ARGS
    // const args = message.content.slice(prefix.length).trim().split(/ +/)
    // const command = args.shift().toLowerCase().slice(message.length - prefix.length)
    let args = ""
    let command = ""
    if(message.content.startsWith(prefix) || message.content == `<@!${BotInfo["ID"]}>`){
        args = message.content.slice(prefix.length).trim().split(/ +/)
        command = args.shift().toLowerCase().slice(message.length - prefix.length)
    } else {
        args = message.content.slice(22).trim().split(/ +/)
        command = args.shift().toLowerCase().slice(message.length - 22)
    }

    // IF BOT IS DISABLED
    if(fs.readFileSync("./DataBase/status.txt", "utf8")=="off" && command!="owner") return

    // IF BOT IS MENTIONNED IN THE CHAT
    let UserMention = message.mentions.users.first();
    // console.log(message.content)
    // if (UserMention!=null && UserMention.id==BotInfo["ID"] && "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(message.content.slice(0,1))) { // If the bot is mentioned
    // if (UserMention!=null && UserMention.id==BotInfo["ID"] && message.content.slice(0,1)=="<") { // If the bot is mentioned
    if (message.content == `<@!${BotInfo["ID"]}>`) { // If the bot is mentioned
        message.channel.send(`${message_language[languages[message.guild.id]]["Mentionned"]} **${prefix}**`)
    }

    // COMMAND TRIGGER
    // if(message.content.startsWith(prefix)){ // Command detected
    if(message.content.startsWith(prefix) || message.content.startsWith(`<@${BotInfo["ID"]}>`) || message.content.startsWith(`<@!${BotInfo["ID"]}>`)){ // Command detected
        // if(!DATAS["commands"]) DATAS["commands"]=0
        // DATAS["commands"] = DATAS["commands"] + 1
        // fs.writeFile("./DataBase/DATAS.json", JSON.stringify(DATAS), (err) => {
        //     if (err) console.error();
        // });

        // IF USER IS BLACKLISTED
        let blacklist = JSON.parse(fs.readFileSync("./DataBase/blacklist.json", "utf8"));
        if(blacklist.includes(message.author.id)) {
            // message.delete()
            message.author.send(`${message_language[languages[message.guild.id]]["Blacklisted"]}`)
            return
        }

        // COMMAND COOLDOWN
        if (commandedRecently.has(message.author.id) && !message.member.hasPermission("ADMINISTRATOR")) { // Command Cooldown
            const Embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(`:alarm_clock: ${message_language[languages[message.guild.id]]["WaitCommandCooldown"]}`)
            .setColor("ORANGE")
            message.lineReplyNoMention(Embed)
        } else {
            // if(!bot.commands.has(command)) return // message.lineReply("Erreur: Cette commande n'existe pas");

            // GET ALL ARGS
            argsresult = args.join(" ");

            // WEBHOOK LOGS SYSTEM
            var URL = fs.readFileSync("./DataBase/webhook-logs-url.txt", "utf8") // Webhook Logs System
            if(bot.commands.has(command))fetch(URL, {
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
                            "timestamp": new Date(),
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

            // IF BOT HAS NOT ADMINISTRATOR PERMISSIONS
            if(!message.guild.me.hasPermission("ADMINISTRATOR")) return message.lineReply(`${message_language[languages[message.guild.id]]["NeedAdminPerms"]}`)

            // EXECUTE ASSOCIED COMMAND
            execution = bot.commands.get(command)||bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(command))
            if(execution) execution.execute(message, args, bot, Discord.Guild, BotInfo, token, prefix, prefixes, bot.prefix, bot.user.id)


            // UPDATE COOLDOWN
            commandedRecently.add(message.author.id);
            setTimeout(() => {
            commandedRecently.delete(message.author.id);
            }, 3000); // DELAY
        }
    } else { // MESSAGE IS NOT A COMMAND
        // if(!DATAS["messages"]) DATAS["messages"]=0
        // DATAS["messages"] = DATAS["messages"] + 1
        // fs.writeFile("./DataBase/DATAS.json", JSON.stringify(DATAS), (err) => {
        //     if (err) console.error();
        // }); 
    }
});


// TOKEN CONNECTION
bot.login(token)
.catch(error => {
    // ERROR
    console.error("Unable to connect the Bot to internet:\n"+error)
})