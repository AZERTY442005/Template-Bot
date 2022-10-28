const fs = require('fs')

module.exports = {
    name: 'emojiCreate',
    execute(emoji)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("emojiCreate")
        }
    }
}