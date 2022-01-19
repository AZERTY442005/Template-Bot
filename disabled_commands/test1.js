const Discord = require("discord.js");
const bot = new Discord.Client;
const token = "NzgyODg1Mzk4MzE2NzExOTY2.X8Ss2A.YTJHjn-P3zo-Cncts2NqaGctAC8";
const prefix = "/";
//const channelgénéral = bot.channels.cache.find(channel => channel.id === "782886209059029015");
//const channeltests = bot.channels.cache.find(channel => channel.id === "782918746159317022");

bot.on("ready", () => {
    console.log("AzerBot has started");
/////    message.send("AzerBot has started");
    const channellogs = bot.channels.cache.find(channel => channel.id === "782970157689602098");
    channellogs.send("**AzerBot has started**");
});

bot.on("message", message => {
    // !ping
    if(message.content == prefix + "ping"){
        message.channel.send("pong");
    }

    // !stat
    if(message.content == prefix + "stat"){
        message.channel.send(message.author.username + " a envoyé un message");
    }

    // !testsend
    if(message.content == prefix + "testsend"){
        const channeltests = bot.channels.cache.find(channel => channel.id === "782918746159317022");
        channeltests.send("test");
    }

    // !delete
    if(message.content == prefix + "delete"){
        message.delete();
    }
    
    // !test
    if(message.content == prefix + "test"){
        message.channel.send("1  2,  1  2")
    }
});

bot.login(token);