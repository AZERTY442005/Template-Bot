const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "unban",
    description: "unbans a member from the server",
    execute(message, args) {
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Bannir des Membres)")
        if(!args[0]) return message.lineReply("Erreur: Veuillez préciser un ID d'utilisateur")


        let reason = args.slice(1).join(" ");
        if(!reason) reason = 'Non spécifié';

        let userID = args[0]

        const banembed = new MessageEmbed()
        .setTitle('UNBAN')
        .setDescription(`Un utilisateur a été débanni du serveur`)
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor("#00C632")
        .addFields(
            {name:'User Unbanned',value:"<@"+userID+">",inline:true},
            {name:'Unbanned by',value:message.author,inline:true},
            {name:'Reason',value:reason,inline:true},
        )
        .setTimestamp()

        message.guild.fetchBans().then(bans=> {
        if(bans.size == 0) return message.lineReply("Erreur: Aucun utilisateur n'est banni")
        let bUser = bans.find(b => b.user.id == userID)
        if(!bUser) return message.lineReply("Erreur: Cet utilisateur n'est pas banni")
        message.guild.members.unban(bUser.user, `${message.author.tag}: ${reason}`)
        message.delete()
        message.channel.send(banembed);
        })

        
    }
}