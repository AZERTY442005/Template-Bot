const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const { send } = require("process");

module.exports = {
    name: 'rules2',
    description: "Créer un règlement sur le serveur",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        let rules = JSON.parse(fs.readFileSync("./DataBase/rules.json", "utf8"));
        if(!rules[message.guild.id]) rules[message.guild.id] = {}
        if(!rules[message.guild.id]["titles"]) rules[message.guild.id]["titles"] = []
        if(!rules[message.guild.id]["descriptions"]) rules[message.guild.id]["descriptions"] = []
        fs.writeFile("./DataBase/rules.json", JSON.stringify(rules), (err) => {
            if (err) console.error();
        });
        const usermention = message.mentions.users.first()
        if(args[0] && !"helplistaddremovesend".includes(args[0]) && !usermention || args[0]=="help") { // HELP PAGE
            let EmbedHelp = new MessageEmbed()
            .setTitle(`RULES COMMANDS`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("GREEN")
            .addField(`${prefix}rules (<user>)`, "Envoie le règlement du serveur par message privé")
            .addField(`${prefix}rules list`, "Liste les règles du règlement")
            .addField(`${prefix}rules add <title> <description>`, "Ajoute une règle au règlement")
            .addField(`${prefix}rules remove <id>`, "Supprime une règle du règlement")
            .addField(`${prefix}rules send`, "Envoie le règlement du serveur dans le salon actuel")
            .setTimestamp()
            message.channel.send(EmbedHelp)
            return
        }
        if(!args[0] || (usermention && !args[1])) { // SEND RULES MP
            if(rules[message.guild.id]["titles"].length==0) return message.lineReply(`Erreur: Il n'y a aucune règle dans le règlement`)
            let EmbedSend = new MessageEmbed()
            .setTitle(`Règlement`)
            .setDescription(`Liste des règles du serveur **${message.guild.name}**`)
            .setColor("GREEN")
            .setFooter(`${config["BotInfo"]["name"]}`, `${config["BotInfo"]["IconURL"]}`)
            .setTimestamp()
            for(let i = 0; i < rules[message.guild.id]["titles"].length; i++) {
                EmbedSend.addField(`${i+1} - ${rules[message.guild.id]["titles"][i]}`, rules[message.guild.id]["descriptions"][i])
            }

            if (!args[0]) {
                message.author.send(EmbedSend)
                message.lineReply("Le règlement vous a été envoyé en messages privés")
            } else {
                if(!message.member.hasPermission("ADMINISTRATOR")) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Administrateur")
                usermention.send(EmbedSend)
                message.delete()
            }
            return
        }
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Administrateur")
        if(args[0]=="list") { // LIST RULES
            let EmbedList = new MessageEmbed()
            .setTitle(`RULES LIST`)
            .setColor("GREEN")
            .setTimestamp()
            for(let i = 0; i < rules[message.guild.id]["titles"].length; i++) {
                EmbedList.addField(`ID:${i} - ${rules[message.guild.id]["titles"][i]}`, rules[message.guild.id]["descriptions"][i])
            }
            message.channel.send(EmbedList)
        }
        if(args[0]=="add") { // ADD RULE
            let title = args[1]
            let description = args.slice(2).join(" ");

            rules[message.guild.id]["titles"].push(title)
            rules[message.guild.id]["descriptions"].push(description)
            fs.writeFile("./DataBase/rules.json", JSON.stringify(rules), (err) => {
                if (err) console.error();
            });

            let EmbedAdd = new MessageEmbed()
            .setTitle(`RULES MODIFICATION`)
            .setColor("GREEN")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .addField(`Une nouvelle règle a été ajoutée` ,`__${title}:__ ${description}`)
            .setTimestamp()
            message.channel.send(EmbedAdd)
        }
        if(args[0]=="remove") { // REMOVE RULE
            let id = parseInt(args[1])
            if(!id) return message.lineReply(`Erreur: Veuillez préciser l'ID d'une règle\n*${prefix}rules remove <id>*`)

            if(!rules[message.guild.id]["titles"][id]) return message.lineReply(`Erreur: Veuillez préciser un ID de règle valide`)
            const oldtitle = rules[message.guild.id]["titles"][id]
            const olddescription = rules[message.guild.id]["descriptions"][id]
            delete rules[message.guild.id]["titles"][id]
            delete rules[message.guild.id]["descriptions"][id]
            fs.writeFile("./DataBase/rules.json", JSON.stringify({}), (err) => {
                if (err) console.error();
            });
            fs.writeFile("./DataBase/rules.json", JSON.stringify(rules), (err) => {
                if (err) console.error();
            });

            let EmbedAdd = new MessageEmbed()
            .setTitle(`RULES MODIFICATION`)
            .setColor("GREEN")
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .addField(`Une règle a été supprimée` ,`__${oldtitle}:__ ${olddescription}`)
            .setTimestamp()
            message.channel.send(EmbedAdd)
        }
        if(args[0]=="send") { // SEND RULES CHANNEL
            if(rules[message.guild.id]["titles"].length==0) return message.lineReply(`Erreur: Il n'y a aucune règle dans le règlement`)
            let EmbedSend = new MessageEmbed()
            .setTitle(`Règlement`)
            .setDescription(`Liste des règles du serveur **${message.guild.name}**`)
            .setColor("GREEN")
            .setFooter(`${config["BotInfo"]["name"]}`, `${config["BotInfo"]["IconURL"]}`)
            .setTimestamp()
            for(let i = 0; i < rules[message.guild.id]["titles"].length; i++) {
                EmbedSend.addField(`${i+1} - ${rules[message.guild.id]["titles"][i]}`, rules[message.guild.id]["descriptions"][i])
            }
            message.delete()
            message.channel.send(EmbedSend)
        }
    }
}