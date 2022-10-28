const fs = require('fs')

module.exports = {
    name: 'channelUpdate',
    execute(oldChannel, newChannel)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("channelUpdate")
        }
    }
}