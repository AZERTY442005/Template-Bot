const fs = require("fs")

module.exports = {
    name: 'shutdown',
    description: "Arrête le bot",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(message.author.id != config["OwnerID"]) return message.lineReply("Erreur: Vous n'êtes pas le propriétaire du bot")
        try{
            console.log(`${config["BotInfo"]["name"]} stopped with /shutdown by ${message.author.username}`)
            process.exit()
        } catch {
            message.channel.send("Erreur lors de l'arrêt du bot")
        }
        
    }
}