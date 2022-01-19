const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'serverinfo',
    description: "Affiche les infos du serveur",
    execute(message, args, guild) {
//        message.channel.send(`__${message.guild.name}:__ \n ID: ${message.guild.id} \n Members: ${message.guild.memberCount} \n Icon: ${message.guild.icon} `);
//        let image = message.guild.displayAvatarURL()
        let Embed = new MessageEmbed()
            .setTitle("SERVER INFO")
//            .setColor("#15f153")
            .setColor("#7289DA")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
//            .setImage(image)
            .addField("Nom du serveur", message.guild.name)
            .addField("Créé le", message.guild.createdAt)
//            .addField("You joined", message.guild.joinedAt)
            .addField("Total des membres", message.guild.memberCount)
        message.channel.send(Embed)
    }
}