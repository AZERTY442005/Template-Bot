const fs = require('fs')

module.exports = {
    name: 'presenceUpdate',
    execute(oldMember, newMember)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("presenceUpdate")
        }
    }
}