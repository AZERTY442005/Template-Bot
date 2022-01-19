const { MessageEmbed } = require("discord.js");
const fs = require("fs")

module.exports = {
    name: 'ban',
    description: "Ban un utilisateur",
    execute(message, args) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        if(!message.member.hasPermission("BAN_MEMBERS")) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Bannir des Membres)")
        if(!args[0]) return message.lineReply(`Erreur: Veuillez préciser un utilisateur\n*${prefix}ban <user> (<reason>)*`)
        message.delete()
        const userBan = message.mentions.users.first();
        if (userBan) {
            const member = message.guild.member(userBan);
            let reasonBan = args.slice(1).join(" ");
            if(!reasonBan) reasonBan = 'Non spécifié';
            if (member){
                member.ban(`${message.author.tag}: ${reasonBan}`).then(() =>{
                    let AvatarBan = userBan.displayAvatarURL()
                    let EmbedBan = new MessageEmbed()
                        .setTitle(`BAN`)
                        .setDescription(`Un utilisateur a été banni du serveur`)
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setColor("RED")
                        .setThumbnail(AvatarBan)
                        .addFields(
                            {name:"Modérateur",value:`${message.author}`,inline:true},
                            {name:"Membre Banni",value:`${userBan}`,inline:true},
                            {name:"Raison",value:`${reasonBan}`,inline:true},
                            // {name:"Mod ID",value:`${message.author.id}`,inline:true},
                            // {name:"Banned ID",value:`${userBan.id}`,inline:true},
                            // {name:"Date (M/D/Y)",value:`${new Intl.DateTimeFormat("en-US").format(Date.now())}`,inline:true}
                        )
                        .setTimestamp()
                        message.channel.send(EmbedBan)
                }).catch(err => {
                    if(err=="DiscordAPIError: Missing Permissions") {
                        message.lineReply("Erreur: je n'ai pas les permissions suffisantes pour ban cet utilisateur")
                    } else {
                        message.lineReply(`Erreur: Impossible de ban cet utilisateur\n\`${error}\``)
                    }
                })
            } else {
                message.lineReply(`Erreur: Cet utilisasteur n'est pas sur ce serveur`);
            }
        }
    }
}