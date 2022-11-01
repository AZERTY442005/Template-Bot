const { MessageEmbed } = require("discord.js")
const fs = require("fs")
const fetch = require('node-fetch')
const {format: prettyFormat} = require('pretty-format')
const path = require('path')

module.exports = (error, bot, message, filepath) => {
    // let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
    // const prefix = prefixes[message.guild.id].prefixes;
    const filename = path.basename(filepath).slice(0, -3)
    // let command = new Object()
    // bot.commands.array().forEach(element => {
    //     // console.log(command.name)
    //     if(element.name==filename) command = element
    // });


    const Embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(`:x: ${error}`)
    // .addField(`:x: **${error}**`, `:arrow_right: ${prefix}${command.usage}`)
    .setColor("RED")
    // .setTimestamp()
    // message.channel.send(Embed)
    message.lineReplyNoMention(Embed)
}
