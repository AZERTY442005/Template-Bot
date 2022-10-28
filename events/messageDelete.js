const fs = require('fs')

module.exports = {
    name: 'messageDelete',
    execute(message)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("messageDelete")
            console.log(`message is deleted -> ${message.content}`);
        }
    }
}