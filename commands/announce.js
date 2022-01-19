const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'announce',
    description: "Envoie un message embed pour annoncer",
    execute(message, args) {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Administrateur)")
        if(!args[0]) return message.lineReply("Erreur: Veuillez préciser un message")
        message.delete()
        argsresult = args.slice(0).join(" ");
        let EmbedEmbed = new MessageEmbed()
            .setTitle("ANNONCE")
            .setDescription(`${argsresult}`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("RANDOM")
            .setTimestamp()
            message.channel.send(EmbedEmbed)
    }
}