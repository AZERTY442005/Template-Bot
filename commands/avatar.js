const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'avatar',
    description: "Montre l'avatar d'un utilisateur",
    execute(message, args) {
        let user;
        try{
            if (message.mentions.users.first()) {
                user = message.mentions.users.first();
            } else {
                user = message.author;
            }


            let avatar = user.displayAvatarURL({size: 4096, dynamic: true});
            // 4096 is the new biggest size of the avatar.
            // Enabling the dynamic, when the user avatar was animated/GIF, it will result as a GIF format.
            // If it's not animated, it will result as a normal image format.

            const embed = new MessageEmbed()
                .setTitle(`Avatar de ${user.tag}`)
                .setDescription(`[URL de l'avatar de **${user.tag}**](${avatar})`)
                .setAuthor(message.author.tag, message.author.displayAvatarURL())
                .setColor("0x1d1d1d")
                .setImage(avatar)
                .setTimestamp()
        
        return message.channel.send(embed);
        } catch {
            return message.channel.send("ERREUR: Mention invalide")
        }
    }
}