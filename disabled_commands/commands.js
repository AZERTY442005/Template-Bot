const fs = require("fs")

module.exports = {
    name: 'commands',
    description: "Active/Désactive une commande",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(message.author.id != config["OwnerID"]) return message.channel.send("Erreur: Vous n'êtes pas le propriétaire du bot")
        message.lineReply("Command unavailable (soon)")
        // SOON
    }
}