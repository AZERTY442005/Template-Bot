const Discord = require("discord.js");
const bot = new Discord.Client;
const token = "NzgyODg1Mzk4MzE2NzExOTY2.X8Ss2A.YTJHjn-P3zo-Cncts2NqaGctAC8";
const prefix = "/";
const activities_list = [ 
    "", 
    "rien",
    "(vide)",
    "se faire configurer",
    "/help",
    "te dire bonjour",
    "salut toi",
    "/ et pas !"
    ];

bot.on("ready", () => {
    setInterval(() => {
        const index = Math.floor(Math.random() * (activities_list.length - 1) + 1); 
        bot.user.setActivity(activities_list[index]); 
    }, 5000);
    const channellogs = bot.channels.cache.find(channel => channel.name === "logs-azerbot"); //Here you put the logs channelName
    if(!channellogs) return message.channel.send("ERREUR; Il n'y a pas de salon nommé logs-azerbot existant")
    channellogs.send("------------------------\n**AzerBot has started**\n------------------------");
    console.log("AzerBot has started");
//    bot.user.setActivity("se faire configurer", {type: "PLAYING"});
});

bot.on("message", async message => {
    const prefix = "/";

    // If the author's a bot, return
    // If the message was not sent in a server, return
    // If the message doesn't start with the prefix, return
    if (message.author.bot) return;
    if (!message.guild) return;
    if (!message.content.startsWith(prefix)) return;

    // Arguments and command variable
    // cmd is the first word in the message, aka the command
    // args is an array of words after the command
    // !say hello I am a bot
    // cmd == say (because the prefix is sliced off)
    // args == ["hello", "I", "am", "a", "bot"]
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd === "avatar") {
        let user;
  
        if (message.mentions.users.first()) {
          user = message.mentions.users.first();
        } else if (args[0]) {
          user = message.guild.members.cache.get(args[0]).user;
        } else {
          user = message.author;
        }
        
        let avatar = user.displayAvatarURL({size: 4096, dynamic: true});
        // 4096 is the new biggest size of the avatar.
        // Enabling the dynamic, when the user avatar was animated/GIF, it will result as a GIF format.
        // If it's not animated, it will result as a normal image format.
        
        const embed = new Discord.MessageEmbed()
        .setTitle(`${user.tag} avatar`)
        .setDescription(`[Avatar URL of **${user.tag}**](${avatar})`)
        .setColor(0x1d1d1d)
        .setImage(avatar)
        
        return message.channel.send(embed);
    }
});

bot.login("NzgyODg1Mzk4MzE2NzExOTY2.X8Ss2A.YTJHjn-P3zo-Cncts2NqaGctAC8");