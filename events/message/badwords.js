const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const badwords = [ // Badwords LIST
    "fdp",
    "merde",
    "ptn",
    "tg",
    "bite",
    "ntm",
    "enculé",
    "encule",
    "putain",
    "nique",
    "pute",
    "gueule",
    "batard",
    "fuck",
    "fck",
    "ahhaha"
]

module.exports = {
    name: "message",
    execute(message) {
        if(message.author.bot) return;
        if(message.guild == null) return
        if(message.channel.type == "dm"||message.channel.type==="group") return;
        if(message.channel == null) return;
    
        // VARS
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        if(!prefixes[message.guild.id]) { // If prefix is not defined for the server
            prefixes[message.guild.id] = {
                prefixes: `${JSON.parse(fs.readFileSync("./config.json", "utf8"))["DefaultPrefix"]}`,
            }
            fs.writeFile("./DataBase/prefixes.json", JSON.stringify(prefixes), (err) => {
                if (err) console.error();
            })
        }
        const prefix = prefixes[message.guild.id].prefixes;
        let languages = JSON.parse(fs.readFileSync("./DataBase/languages.json", "utf8"));
        let message_language = JSON.parse(fs.readFileSync("./DataBase/message-language.json", "utf8"));
        if(!languages[message.guild.id]) {
            languages[message.guild.id] = "en"
        }
    
        // IF BOT IS DISABLED
        if(fs.readFileSync("./DataBase/status.txt", "utf8")=="off" && command!="owner") return

        
        // BADWORDS DETECTOR
        if(!message.member.hasPermission("ADMINISTRATOR")) { // Badwords detector
            let confirm = false
            var i;
            let badword = ""
            for(i = 0;i < badwords.length; i++) {
                if(message.content.toLowerCase().includes(badwords[i].toLowerCase()))
                    confirm = true
                    // const word = badwords[i]
                    badword = badwords[i]
            }
            if(confirm) {
                let warns = JSON.parse(fs.readFileSync("./DataBase/warns.json", "utf8"));
                if(!warns[message.guild.id]) warns[message.guild.id]={}
                if(!warns[message.guild.id][message.author.id]) {
                    warns[message.guild.id][message.author.id] = {
                        warns: 0,
                    }
                    fs.writeFile("./DataBase/warns.json", JSON.stringify(warns), (err) => {
                        if (err) console.error();
                    })
                }
                message.delete().catch(error => {
                    console.error("Badwords Deletion: "+error)
                })
                // let UserWarn = message.author.id
                UserWarns = parseInt(warns[message.guild.id][message.author.id].warns)
                // const ReasonWarn = `Badword: ${message.content}`
                const ReasonWarn = `Badword: ${badword}`
                let AvatarWarn = message.author.displayAvatarURL()
                //let ChannelWarn = message.guild.channels.cache.find(channel => channel.name === "warns")
                let EmbedWarn = new MessageEmbed()
                .setTitle(`WARN`)
                .setDescription(``)
                .setColor("ORANGE")
                .setThumbnail(AvatarWarn)
                .addFields(
                    {name:`${message_language[languages[message.guild.id]]["Moderator"]}`,value:`<@${config["BotInfo"]["ID"]}>`,inline:true},
                    {name:`${message_language[languages[message.guild.id]]["WarnedMember"]}`,value:`<@${message.author.id}>`,inline:true},
                    {name:`${message_language[languages[message.guild.id]]["Reason"]}`,value:`${ReasonWarn}`,inline:true},
                )
                .setTimestamp()
                message.channel.send(EmbedWarn)
                warns[message.guild.id][message.author.id] = {
                    warns: UserWarns + 1,
                }
                fs.writeFile("./DataBase/warns.json", JSON.stringify(warns), (err) => {
                    if (err) console.error();
                })
            }
        }
    },
};
