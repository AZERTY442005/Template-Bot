const Discord = require("discord.js");
const bot = new Discord.Client;
const token = "NzgyODg1Mzk4MzE2NzExOTY2.X8Ss2A.YTJHjn-P3zo-Cncts2NqaGctAC8";
const prefix = "/";

bot.on("ready", () => {
    console.log("AzerBot has started");
});

bot.on("message", message => {
    if(message.author.bot) return;
    const msg = await message.channel.send(`🏓 Pinging....`);

    msg.edit(`🏓 Pong!
    Latency is ${Math.floor(msg.createdTimestamp - message.createdTimestamp)}ms
    API Latency is ${Math.round(client.ping)}ms`);
})

bot.login(token);