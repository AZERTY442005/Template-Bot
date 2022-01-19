const { MessageEmbed } = require("discord.js");
const { title } = require("process");

module.exports = {
    name: 'embed',
    description: "Me fait écrire un message embed",
    execute(message, args) {
//        if(!args[0]) return message.channel.send("ERREUR: Veuillez préciser une couleur")
        if(!args[0]) return message.lineReply(`Erreur: Veuillez préciser un titre ou un message\n*embed (<titre>) <message>*`)
        if(args[1]) {
            const title1 = args[0]
            const desc1 = args.slice(1).join(" ");
//            const color1 = args[0]
            let embed1 = new MessageEmbed()
            .setTitle(`${title1}`)
            .setDescription(`${desc1}`)
            .setColor("RANDOM")
        message.channel.send(embed1)
        message.delete()
        } else {
            const desc2 = args.slice(0).join(" ");
//            const color2 = args[0]
            let embed2 = new MessageEmbed()
            .setDescription(`${desc2}`)
            .setColor("RANDOM")
        message.channel.send(embed2)
        message.delete()
        }
    }
}