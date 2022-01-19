module.exports = {
    name: 'ghostping',
    description: "Envoie un ghostping",
    execute(message, args) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Gérer les Messages)")
        if(!args[0]) return message.lineReply("Erreur: Veuillez préciser un utilisateur")
        message.delete()
    }
}