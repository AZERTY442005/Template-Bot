const { MessageEmbed } = require("discord.js");
const fs = require("fs")

module.exports = {
    name: 'credits',
    description: "Affiche mes credits",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
       let avatar = config["BotInfo"]["IconURL"]
       let EmbedCredits = new MessageEmbed()
            .setTitle("CREDITS")
            .setThumbnail(avatar)
            .setColor("RANDOM")
            .addFields(
                {name:`Name`,value:`${config["BotInfo"]["name"]}`,inline:true},
                {name:`Version`,value:`${config["BotInfo"]["version"]}`,inline:true},
                {name:`Created at`,value:`${config["BotInfo"]["CreatedAt"]}`,inline:true},
                {name:`Creator`,value:"<@452454205056352266>",inline:true},
                {name:`Owner`,value:`<@${config["OwnerID"]}>`,inline:true},
            )
            .setFooter(`${config["BotInfo"]["name"]}`, `${config["BotInfo"]["IconURL"]}`)
            .setTimestamp()
            message.channel.send(EmbedCredits)
    }
}