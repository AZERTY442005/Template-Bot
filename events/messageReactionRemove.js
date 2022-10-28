const fs = require('fs')

module.exports = {
    name: 'messageReactionRemove',
    execute(messageReaction, user)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("messageReactionRemove")
        }
    }
}