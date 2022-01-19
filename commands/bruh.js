const { MessageEmbed } = require("discord.js");

module.exports = {
    name: 'bruh',
    description: "Envoie un GIF aléatoire de bruh",
    execute(message, args) {
        const bruhlist = [
            "https://tenor.com/view/bruh-bye-ciao-gif-5156041",
            "https://tenor.com/view/off-work-traffic-bruh-gif-14207439",
            "https://tenor.com/view/bruh-bye-ciao-gif-5156041",
            "https://cdn.discordapp.com/attachments/782886209059029015/783076615571636274/bruh.png",
            "https://tenor.com/view/bruh-phone-drop-micdrop-ded-dead-gif-4568216",
            "https://tenor.com/view/kevin-hart-stare-blink-really-you-serious-gif-7356251",
            "https://tenor.com/view/spit-take-laugh-lmao-gif-9271200",
            "https://tenor.com/view/bruh-bye-ciao-gif-5156041",
            "https://tenor.com/view/off-work-traffic-bruh-gif-14207439",
            "https://tenor.com/view/bruh-bye-ciao-gif-5156041",
            "https://cdn.discordapp.com/attachments/782886209059029015/783076615571636274/bruh.png",
            "https://tenor.com/view/bruh-phone-drop-micdrop-ded-dead-gif-4568216",
            "https://tenor.com/view/kevin-hart-stare-blink-really-you-serious-gif-7356251",
            "https://tenor.com/view/spit-take-laugh-lmao-gif-9271200",
        ]
        const bruhindex = Math.floor(Math.random() * (bruhlist.length - 1)); 
        message.lineReply(bruhlist[bruhindex])
        let Embed = new MessageEmbed()
        .setAuthor(message.author.tag, message.author.displayAvatarURL())
        .setColor("RANDOM")
        .setImage(bruhlist[bruhindex])
        .setTimestamp()
        // message.channel.send(Embed)
    }
}