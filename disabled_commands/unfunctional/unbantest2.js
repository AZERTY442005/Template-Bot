const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "unban2",
    description: "unbans a member from the server",
    execute(message, args, bot) {
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("Erreur: Vous n'avez pas la permission de faire ceci! (Bannir des Membres)")

        const member = message.mentions.users.first();
        console.log("member: "+member)

        if(!args[0]) return message.reply("Erreur: Veuillez préciser un utilisateur")



        

        let reason = args.slice(1).join(" ");

        if(!reason) reason = 'Non spécifié';

        message.guild.members.unban(`${member}`, `${reason}`)
        .catch(err => {
            if(err) return message.channel.send('Something went wrong')
        })

        const banembed = new MessageEmbed()
        .setTitle('Member Unbanned')
        .addField('User Unbanned', "<@"+member+">")
        .addField('Unbanned by', message.author)
        .addField('Reason', reason)
        // .setFooter('Time Unbanned', bot.displayAvatarURL())
        .setTimestamp()

        message.channel.send(banembed);


    }
}