const fs = require('fs')

module.exports = {
    name: 'channelCreate',
    execute(channel) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("channelCreate")
        }
    }
}