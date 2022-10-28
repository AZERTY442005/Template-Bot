const fs = require('fs')

module.exports = {
    name: 'typingStart',
    execute(channel, user)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("typingStart")
            console.log(channel)
            console.log(user)
        }
    }
}