const { MessageEmbed } = require("discord.js")
const fs = require("fs")
const fetch = require('node-fetch')
const {format: prettyFormat} = require('pretty-format')
const path = require('path')

module.exports = (error, usage, bot, message, filepath, MP) => {
    let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
    const prefix = prefixes[message.guild.id].prefixes;
    // const filename = path.basename(filepath).slice(0, -3)
    // let command = new Object()
    // bot.commands.array().forEach(element => {
    //     // console.log(command.name)
    //     if(element.name==filename) command = element
    // });
    let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
    let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"));
    if(!languages[message.guild.id]) {
        languages[message.guild.id] = "en"
    }


    const Embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    // .addField(`:x: **${error}**`, `__Usage:__ ${prefix}${usage}`)
    .addField(`:x: **${message_language[languages[message.guild.id]]["CustomUserError"][error]}**`, `__Usage:__ ${prefix}${usage}`)
    // .addField(`:x: **${error}**`, `:arrow_right: ${prefix}${command.usage}`)
    .setColor("RED")
    // .setTimestamp()
    // message.channel.send(Embed)
    if(MP) message.author.send(Embed)
    else message.lineReplyNoMention(Embed)
}
