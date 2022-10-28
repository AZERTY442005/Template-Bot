const fs = require('fs')

module.exports = {
    name: 'channelPinsUpdate',
    execute(channel, time) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("channelPinsUpdate")
        }
    }
}