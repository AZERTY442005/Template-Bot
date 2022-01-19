module.exports = {
    name: 'dm',
    description: "Envoie un DM à un utilisateur",
    execute(message, args) {
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Administrateur)")
        let dmUser = message.mentions.users.first();
        if(!args[0]) return message.lineReply("Erreur: Veuillez préciser un utilisateur")
        if(!dmUser) return message.channel.send("Erreur: Veuillez préciser un utilisateur valide")
        //if(dmUser.id == "782885398316711966") return message.channel.send("ERREUR: Veuillez préciser un utilisateur valide (pas moi de préférence)")
        if(!args[1]) return message.lineReply("Erreur: Veuillez préciser un message")
        const dmMessage = args.slice(1).join(" ");
        dmUser.send(dmMessage)
        message.delete()
    }
}