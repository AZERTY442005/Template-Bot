const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'info',
    description: "Affiche les stats d'un utilisateur",
    execute(message, args, guild) {
//        message.channel.send(`__${message.guild.name}:__ \n ID: ${message.guild.id} \n Members: ${message.guild.memberCount} \n Icon: ${message.guild.icon} `);
//        let image = message.guild.displayAvatarURL()
        let user = message.mentions.users.first();
        let Embed = new MessageEmbed()
            .setTitle("SERVER INFO")
            .setColor("#15f153")
//            .setImage(image)
            .addField("User name", message.user.name)
            .addField("Created on", message.user.createdAt)
            .addField("Joined on", message.guild.joinedAt)
        message.channel.send(Embed)
    }
}