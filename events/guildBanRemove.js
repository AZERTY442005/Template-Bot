const fs = require('fs')

module.exports = {
    name: 'guildBanRemove',
    execute(guild, user)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("guildBanRemove")
        }
    }
}