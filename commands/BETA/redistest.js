const fs = require('fs')
const redis = require("./redis");
const command = require("./command");

module.exports = (client) => {
    command(client, "redistest", async (message) => {
        console.log(message.content)

        // VAR PREFIXES
        let prefixes = JSON.parse(
            fs.readFileSync("./DataBase/prefixes.json", "utf8")
        );
        if (!prefixes[message.guild.id]) {
            // If prefix is not defined for the server
            prefixes[message.guild.id] = {
                prefixes: `${
                    JSON.parse(fs.readFileSync("./config.json", "utf8"))[
                        "DefaultPrefix"
                    ]
                }`,
            };
            fs.writeFile(
                "./DataBase/prefixes.json",
                JSON.stringify(prefixes),
                (err) => {
                    if (err) console.error();
                }
            );
        }
        const prefix = prefixes[message.guild.id].prefixes;

        // VAR COMMAND & ARGS
        let args = "";
        let command = "";
        if (
            message.content.startsWith(prefix) ||
            message.content == `<@!${BotInfo["ID"]}>`
        ) {
            args = message.content.slice(prefix.length).trim().split(/ +/);
            command = args
                .shift()
                .toLowerCase()
                .slice(message.length - prefix.length);
        } else {
            args = message.content.slice(22).trim().split(/ +/);
            command = args
                .shift()
                .toLowerCase()
                .slice(message.length - 22);
        }
        console.log("args: "+args)

        if(args[0]=="get") {
            console.log("GET")
            const redisClient = await redis();
            try {
                redisClient.get(`test`, (err, result) => {
                    if (err) {
                        console.error("Redis GET error:", err);
                    } else if (result) {
                        console.log(result);
                    } else {
                        console.log("(no result)");
                    }
                });
            } finally {
                redisClient.quit();
            }
        }
        if(args[0]=="set") {
            console.log("SET")
            const redisClient = await redis();
            try {
                redisClient.set("test", `${args[1]}`);
            } finally {
                redisClient.quit();
            }
        }
    });
};
