const fs = require('fs')

module.exports = {
    name: 'emojiDelete',
    execute(emoji)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("emojiDelete")
        }
    }
}