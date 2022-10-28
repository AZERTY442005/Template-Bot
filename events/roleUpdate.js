const fs = require('fs')

module.exports = {
    name: 'roleUpdate',
    execute(role)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("roleUpdate")
            console.log(role)
        }
    }
}