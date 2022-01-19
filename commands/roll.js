const { MessageEmbed } = require("discord.js");
const fs = require("fs")

module.exports = {
    name: 'roll',
    description: "Choisit un nombre aléatoire entre 1 et 6",
    execute(message, args) {
        let number
        let faces
        if(!args[0]) {
            number = Math.floor(Math.random() * 6 + 1)
            faces = 6
        } else {
            if(!parseInt(args[0])) return message.lineReply(`Erreur: Nombre invalide\n*${prefix}roll (<number>)*`)
            number = Math.floor(Math.random() * parseInt(args[0]) + 1)
            faces = args[0]
        }
        let EmbedRoll = new MessageEmbed()
        .setTitle(`ROLL`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor(message.member.displayHexColor)
        // .setThumbnail(message.author.displayAvatarURL())
        .addField(`Dé à ${faces} faces`, `${number}`)
        .setTimestamp()
        message.channel.send(EmbedRoll)
    }
}