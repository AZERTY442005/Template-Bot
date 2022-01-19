const { MessageEmbed } = require("discord.js");
const fs = require("fs");
const {format: prettyFormat} = require('pretty-format'); // CommonJS

module.exports = {
    name: 'warn',
    description: "Averti un utilisateur",
    execute(message, args) {
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        const prefix = prefixes[message.guild.id].prefixes;
        if(!message.member.hasPermission("KICK_MEMBERS")) return message.lineReply("Erreur: Vous n'avez pas la permission de faire ceci! (Kick des Membres)")
        if(!args[0])return message.lineReply(`Erreur: Vous devez préciser la personne\n${prefix}*warn <user> <reason>*`)

        // console.log("TEST0")

        let warns = JSON.parse(fs.readFileSync("./DataBase/warns.json", "utf8"));

        let UserWarn = message.mentions.users.first()||null

        // try{
        //     console.log("TEST1: "+prettyFormat(warns))
        //     console.log("TEST2: "+warns[message.guild.id][UserWarn.id])
        //     console.log("TEST3: "+warns[message.guild.id][UserWarn.id].warns)
        // } catch (error) {
        //     console.log("Error: "+error)
        // }
        if(!warns[message.guild.id]) warns[message.guild.id]={}
        if(!warns[message.guild.id][UserWarn.id]) {
            warns[message.guild.id][UserWarn.id] = {
                warns: 0,
            }
            // console.log("Warns: "+prettyFormat(warns[message.guild.id]))
            fs.writeFile("./DataBase/warns.json", JSON.stringify(warns), (err) => {
                if (err) console.error();
            })
        }

        // console.log("TEST2: "+prettyFormat(warns))

        try { // Test
            // console.log("ParseInt: "+parseInt(warns[message.guild.id][UserWarn.id].warns))
            UserWarns = parseInt(warns[message.guild.id][UserWarn.id].warns)
        } catch (e) {
            console.error("Error: "+e)
        }


        const ReasonWarn = args.slice(1).join(" ");
        if(UserWarn==null)return message.lineReply(`Erreur: Vous devez préciser la personne\n*${prefix}warn <user> <reason>*`)
        if(!args[1])return message.lineReply(`Erreur: Vous devez préciser la raison\n*${prefix}warn <user> <reason>*`)
        let AvatarWarn = UserWarn.displayAvatarURL()
        //let ChannelWarn = message.guild.channels.cache.find(channel => channel.name === "warns")
        let EmbedWarn = new MessageEmbed()
                    .setTitle(`WARN`)
                    .setDescription(`Un utilisateur a été Warn`)
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setColor("ORANGE")
                    .setThumbnail(AvatarWarn)
                    .addFields(
                        {name:"Modérateur",value:`${message.author}`,inline:true},
                        {name:"Membre Averti",value:`${UserWarn}`,inline:true},
                        {name:"Raison",value:`${ReasonWarn}`,inline:true},
                        // {name:"Mod ID",value:`${message.author.id}`,inline:true},
                        // {name:"Warned ID",value:`${UserWarn.id}`,inline:true},
                        // {name:"Date (M/D/Y)",value:`${new Intl.DateTimeFormat("en-US").format(Date.now())}`,inline:true}
                    )
                    .setTimestamp()
                    message.channel.send(EmbedWarn)
                    
                    warns[message.guild.id][UserWarn.id] = {
                        warns: UserWarns + 1,
                    }
                    fs.writeFile("./DataBase/warns.json", JSON.stringify(warns), (err) => {
                        if (err) console.error();
                    })
                    // console.log("UserWarns B: "+UserWarns)
                    UserWarns=UserWarns+1
                    // console.log("UserWarns A: "+UserWarns)

                    // console.log("TEST3")
    }
}