const fs = require("fs");
const {format: prettyFormat} = require('pretty-format');

module.exports = {
    name: "message",
    execute(message) {
        if(message.author.bot) return;
        if(message.guild == null) return
        if(message.channel.type == "dm"||message.channel.type==="group") return;
        if(message.channel == null) return;
    
        // VAR PREFIXES
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
    
        // IF BOT IS DISABLED
        if(fs.readFileSync("./DataBase/status.txt", "utf8")=="off" && command!="owner") return

        
        // BLOCK-LINKS SYSTEM
        const BlockedLinks = fs.readFileSync("./DataBase/blocked-links.txt", "utf8").split("\n")

        // console.log(prettyFormat(BlockedLinks))
        // console.log(message.content)

        // for(const link in BlockedLinks) {
        //     console.log(message.content+" ? "+BlockedLinks[link])
        //     console.log(typeof message.content+" ? "+typeof BlockedLinks[link])
        //     console.log(message.content.includes(BlockedLinks[link]))
        //     if(message.content.includes(BlockedLinks[link])) {
        //         message.delete()
        //         message.reply("Merci de ne pas envoyer de liens malveillants")
        //     }
        // }

        // message.content.split(" ").forEach(word => {
        //     console.log(word)
        //     console.log(word+" ? "+BlockedLinks)
        //     console.log(BlockedLinks.includes(word))
        // })

        // let regx = /^((?:https?:)?\/\/)?((?:www|m)\.)? ((?:discord\.gg|discordapp\.com))/g
        // let cdu = regx.test(message.content.toLowerCase().replace(/\s+/g, ''))
        // console.log(cdu)

        // function is_url(str) {
        //     let regexp = /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
        //     if(regexp.test(str)) {
        //         return true;
        //     } else {
        //         return false;
        //     }
        // }
        // console.log(is_url(message.content))

        // console.log(message.content.includes(BlockedLinks))

        // console.log(BlockedLinks.includes(message.content))

        // BlockedLinks.forEach(link => {
        //     console.log(link==message.content)
        // })
        
        // BlockedLinks.forEach(link => {
        //     console.log(link.toLowerCase()==message.content.toLowerCase())
        // })
    },
};
