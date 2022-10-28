const fs = require('fs')

module.exports = {
    name: 'typingStop',
    execute(channel, user)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("typingStop")
            console.log(channel)
            console.log(user)
        }
    }
}