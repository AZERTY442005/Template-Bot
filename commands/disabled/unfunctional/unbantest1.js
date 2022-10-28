const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'unban',
    description: "Débanni un utilisateur",
    execute(message, args) {
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("Erreur: Vous n'avez pas la permission de faire ceci! (Bannir des Membres)")
        if(!args[0]) return message.reply("Erreur: Veuillez préciser un utilisateur (ID)")
        // message.delete()
        const UserUnbanID = args[0]
        message.guild.members.unban(UserUnbanID)
        .catch(err => {
            if(err) return message.channel.send('Something went wrong')
        })

        setTimeout(() => {
            console.log("UNBANNED")
        }, 2000)
        message.channel.send("Débanni: "+UserUnbanID)
    }
}