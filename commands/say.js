const fs = require('fs')

module.exports = {
    name: 'say',
    description: "Me fait parler",
    execute(message, args) {
        if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Gérer les Messages)")
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        message.delete()
        argsresult = args.slice(0).join(" ");
        if(!argsresult) return message.lineReply(`Erreur: Veuillez préciser un message\n*${prefix}say <msg>*`)
        message.channel.send(argsresult)
    }
}