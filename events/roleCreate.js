const fs = require('fs')

module.exports = {
    name: 'roleCreate',
    execute(role)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("roleCreate")
            console.log(role)
        }
    }
}