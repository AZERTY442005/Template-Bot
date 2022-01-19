const fs = require('fs')

module.exports = {
    name: 'invite',
    description: "Envoie le lien d'invitation du bot",
    execute(message) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        message.lineReply(`Voici mon lien d'invitation\nhttps://discord.com/api/oauth2/authorize?client_id=${config["BotInfo"]["ID"]}&permissions=8&scope=bot"`)
    }
}