const fs = require('fs')

module.exports = {
    name: 'messageUpdate',
    execute(oldMessage, newMessage)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("messageUpdate")
        }
    }
}