const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'report',
    description: "Me fait écrire pong",
    execute(message, args) {
        let UserReport = message.mentions.users.first()||null
            const ReasonReport = args.slice(1).join(" ");
            if(UserReport==null)return message.lineReply("Erreur: Vous devez préciser la personne\n*report <user> <reason>*")
            if(!args[1])return message.lineReply("Erreur: Vous devez préciser la raison\n*report <user> <reason>*")
            message.delete()
            let AvatarReport = UserReport.displayAvatarURL()
            let ChannelReport = message.guild.channels.cache.find(channel => channel.name === "reports")
            console.log(ChannelReport)
            let EmbedReport = new MessageEmbed()
                        .setTitle(`REPORT`)
                        .setDescription(`Un utilisateur a été rapporté`)
                        .setAuthor(message.author.tag, message.author.displayAvatarURL())
                        .setTimestamp()
                        .setColor("YELLOW")
                        .setThumbnail(AvatarReport)
                        .addFields(
                            {name:"Rapporteur",value:`${message.author.tag}`,inline:true},
                            {name:"Membre Rapporté",value:`${UserReport.tag}`,inline:true},
                            {name:"Raison",value:`${ReasonReport}`,inline:true},
                            // {name:"Mod ID",value:`${message.author.id}`,inline:true},
                            // {name:"Reported ID",value:`${UserReport.id}`,inline:true},
                            // {name:"Date (M/D/Y)",value:`${new Intl.DateTimeFormat("en-US").format(Date.now())}`,inline:true}
                        )
                        .setTimestamp()
                        if (ChannelReport == null) {
                            message.channel.send(EmbedReport)
                        } else {
                            ChannelReport.send(EmbedReport)
                        }
                        
    }
}