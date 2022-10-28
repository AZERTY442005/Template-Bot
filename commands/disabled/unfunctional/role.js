const { MessageEmbed } = require("discord.js")

module.exports = {
    name: 'role',
    description: "Contrôle des rôles",
    execute(message, args, prefix) {
        if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("ERREUR: Vous n'avez pas la permission de faire ceci!")
        if(!args[0]) return message.channel.send("ERREUR: Veuillez préciser une action (/role help)")
        if(args[0] == "help") {
            let Embed = new MessageEmbed()
                .setTitle("__ROLES COMMANDS LIST__")
                .setColor("#CA0000")
                .addField(`${prefix}role help`, "Affiche cette page")
                .addField(`${prefix}role useradd <role>`, "Vous ajoute un rôle")
                .addField(`${prefix}role userremove <role>`, "Vous retire un rôle")
                .addField(`${prefix}role add <newrole>`, "Crée un rôle")
                .addField(`${prefix}role remove <role>`, "Supprime un rôle")
                message.channel.send(Embed)
                return
        }
        if(args[0] == "useradd") { 
            if(!args[1]) return message.channel.send("ERREUR: Veuillez préciser un rôle")
            try {
                
                let role = message.guild.roles.cache.find(r => r.name === args[1].toString())
                console.log(role)
                if(role) {
                    const mention = message.mentions.users.first();
                    if (message.member.roles.cache.has(role.id)) return message.channel.send("ERREUR: L'utilisateur possède déjà ce rôle")
                    
                    message.member.roles.add(role)
                        .then(m => message.channel.send(`Vous possédez maintenant le rôle ${role}`))
                        .catch(e => console.log(e))
                } else {
                    message.channel.send("ERREUR: Ce rôle n'existe pas")
                }
            } catch {
                message.channel.send("ERREUR: Ce rôle n'existe pas")
            }
        }

        if(args[0] == "userremove") { 
            if(!args[1]) return message.channel.send("ERREUR: Veuillez préciser un rôle")
            try {
                
                let role = message.guild.roles.cache.find(r => r.name === args[1].toString())
                console.log(role)
                if(role) {
                    const mention = message.mentions.users.first();
                    if (!message.member.roles.cache.has(role.id)) return message.channel.send("ERREUR: L'utilisateur ne possède pas ce rôle")
                    
                    message.member.roles.remove(role)
                        .then(m => message.channel.send(`Vous ne possédez plus le rôle ${role}`))
                        .catch(e => console.log(e))
                } else {
                    message.channel.send("ERREUR: Ce rôle n'existe pas")
                }
            } catch {
                message.channel.send("ERREUR: Ce rôle n'existe pas")
            }
        }

        if(args[0] == "add") {
            if(!args[1]) return message.channel.send("ERREUR: Veuillez préciser un nom de rôle")

        }
    }
}