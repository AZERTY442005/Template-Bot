const { MessageEmbed } = require("discord.js")
const fs = require("fs")

module.exports = {
    name: 'prefix',
    description: "Affiche le préfix",
    execute(message, args) {
        try {
            let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
            let prefix = prefixes[message.guild.id].prefixes
            let Embed = new MessageEmbed()
            .setTitle("PREFIX")
            .setColor("#FFCA2B")
            .setDescription(`Le préfix actuel est **${prefix}**`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
            message.channel.send(Embed)
        } catch {
            message.lineReply("Erreur: Aucun préfix customisé...")
            message.lineReply("Préfix customisé créé avec succès")
        }
    }
}