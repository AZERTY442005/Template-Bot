const fs = require('fs')

module.exports = {
    name: 'guildDelete',
    execute(guild) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("guildDelete")
        }
    }
}