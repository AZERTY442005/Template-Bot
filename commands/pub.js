const { MessageEmbed } = require("discord.js");
const fs = require('fs');
const { url } = require("inspector");

module.exports = {
    name: 'pub',
    description: "Envoie une publicité",
    execute(message, args) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Gérer les Messages)")
        if(!args[0]) return message.lineReply(`Erreur: Vous devez spécifier le titre\n*${prefix}pub <title> <message>*`)
        if(!args[1]) return message.lineReply(`Erreur: Vous devez spécifier le message\n*${prefix}pub <title> <message>*`)
        let title = args[0]
        let description = args.slice(1).join(" ");

        let Embed = new MessageEmbed()
            .setTitle(`${title}`)
            .setDescription(`${description}`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor(message.member.displayHexColor)
            .setTimestamp()
        message.channel.send(Embed)
        message.delete()
    }
}