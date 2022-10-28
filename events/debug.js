const fs = require('fs')

module.exports = {
    name: 'debug',
    execute(info) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) console.log(info)
    }
}