const { MessageEmbed } = require("discord.js")
const fs = require("fs")
const fetch = require('node-fetch')
const {format: prettyFormat} = require('pretty-format')
const path = require('path')

module.exports = (msg, bot, message, filepath) => {
    let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
    const prefix = prefixes[message.guild.id].prefixes;
    const filename = path.basename(filepath).slice(0, -3)
    let command = new Object()
    bot.commands.array().forEach(element => {
        if(element.name==filename) command = element
    });


    const Embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    .setDescription(`:white_check_mark: ${msg}`)
    .setColor("GREEN")
    message.lineReplyNoMention(Embed)
}
