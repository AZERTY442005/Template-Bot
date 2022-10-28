const fs = require('fs')

module.exports = {
    name: 'guildMemberUpdate',
    execute(oldMember, newMember)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("guildMemberUpdate")
        }
    }
}