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
    let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
    let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"));
    if(!languages[message.guild.id]) {
        languages[message.guild.id] = "en"
    }


    const Index = error.split(" ").shift()
    const args = error.substr(error.indexOf(" ") + 1).split(" ")
    let sended = message_language[languages[message.guild.id]]["Error"][Index]
    .replace("{0}", `${args[0]}`)
    .replace("{1}", `${args[1]}`)
    .replace("{2}", `${args[2]}`)
    .replace("{3}", `${args[3]}`)
    .replace("{4}", `${args[4]}`)
    const Embed = new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL())
    // .setDescription(`:x: ${error}`)
    // .setDescription(`:x: ${message_language[languages[message.guild.id]]["Error"][error]}`)
    .setDescription(`:x: ${sended}`)
    // .addField(`:x: **${error}**`, `:arrow_right: ${prefix}${command.usage}`)
    .setColor("RED")
    // .setTimestamp()
    // message.channel.send(Embed)
    message.lineReplyNoMention(Embed)
}
