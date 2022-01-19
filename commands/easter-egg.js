module.exports = {
    name: 'easter-egg',
    description: "GG tu as trouvé l'easter-egg!!!",
    execute(message) {
        message.delete()
        message.channel.send(`GG <@${message.author.id}>, tu as trouvé le premier easter egg\nJe t'ai envoyé l'indice du deuxième en message privé\nQue la chasse aux easter eggs commence!!!`)
        message.author.send(`GG <@${message.author.id}>, tu as trouvé le premier easter egg\n*PS: évite de partager la commande 😅*\nIndice n°2: (en dev)`)
    }
}