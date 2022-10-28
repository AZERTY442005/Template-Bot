const fs = require('fs')

module.exports = {
    name: 'roleDelete',
    execute(role)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("roleDelete")
            console.log(role)
        }
    }
}