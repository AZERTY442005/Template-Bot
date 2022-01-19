module.exports = {
    name: 'clear',
    description: "Supprime des messages",
    execute(message, args) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Gérer les Messages)")
        if(Number(args[0]) <= 0 || isNaN(args[0])) return message.lineReply("Erreur: Veuillez préciser un nombre supérieur à 0")
        const amount = Number(args[0]) > 100
            ? 101
            : Number(args[0]) + 1;
        message.channel.bulkDelete(amount, true)
          .then((_message) => {
            message.channel
              .send(`:broom: \`${_message.size-1}\` messages supprimés`)
              .then((sent) => {
                setTimeout(() => {
                  sent.delete();
                }, 2500);
              });
          }).catch(error => {
            message.lineReply(`Erreur: Impossible de supprimer ce nombre de message`)
          })
    }
}