const fs = require('fs')

module.exports = {
    name: 'guildUpdate',
    execute(oldGuild, newGuild)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("guildUpdate")
        }
    }
}