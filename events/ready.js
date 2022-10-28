const fs = require('fs')
const fetch = require('node-fetch');

module.exports = {
    name: 'ready',
    execute(bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

        // bot.user.setActivity()
        
        const date = new Date()
        const uptime = [("0" + date.getHours()).slice(-2),
            ("0" + date.getMinutes()).slice(-2),
            ("0" + date.getSeconds()).slice(-2)].join(':')+' '+
            [("0" + date.getDate()).slice(-2),
            ("0" + date.getMonth()+1).slice(-2),
            date.getFullYear()].join('/')
        

        fs.writeFile("./DataBase/uptime.txt", `${uptime}`, (err) => {
            if (err) console.error();
        })

        const Guilds_name = bot.guilds.cache.map(guild => guild.name);
        const Guilds_id = bot.guilds.cache.map(guild => guild.id);
        let guilds_list = ""
        for (const guild in Guilds_name) {
            guilds_list=guilds_list+`${Guilds_name[guild]}: ${Guilds_id[guild]}\n`
        }
        guilds_list=guilds_list.slice(0, -1)

        // let user_count = 0
        // bot.guilds.cache.map(guild => {
        //     user_count = user_count + guild.memberCount
        // });

        let UsersList = new Array()
        bot.guilds.cache.forEach(guild => {
            guild.members.cache.forEach(member => {
                if(!UsersList.includes(member.user.username)) UsersList.push(member.user.username)
            })
        })

        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        bot.guilds.cache.forEach(guild => {
            if(!prefixes[guild.id]) {
                prefixes[guild.id] = {
                    prefixes: `${JSON.parse(fs.readFileSync("./config.json", "utf8"))["DefaultPrefix"]}`,
                }
                fs.writeFile("./DataBase/prefixes.json", JSON.stringify(prefixes), (err) => {
                    if (err) console.error();
                })
            }
        })
        

        var URL = fs.readFileSync("./DataBase/webhook-logs-url.txt", "utf8")
        fetch(URL, { // STARTED
            "method":"POST",
            "headers": {"Content-Type": "application/json"},
            "body": JSON.stringify(
                {
                    "username": `${config["BotInfo"]["name"]} Logs`,
                    "avatar_url": `${config["BotInfo"]["IconURL"]}`,
                    "embeds": [
                        {
                        "title": "__Started__",
                        // "description": "Text message. You can use Markdown here. *Italic* **bold** __underline__ ~~strikeout~~ [hyperlink](https://google.com) `code`",
                        "color": 1173539,
                        "timestamp": new Date(),
                        "author": {
                            "name": `${config["BotInfo"]["name"]}`,
                            "icon_url": `${config["BotInfo"]["IconURL"]}`,
                        },
                        "fields": [
                            {
                            "name": `Servers (${Guilds_name.length})`,
                            "value": `${guilds_list}`,
                            "inline": false
                            },
                            {
                            "name": `Users (${UsersList.length})`,
                            "value": `${UsersList.join(", ")}`,
                            "inline": false
                            }
                        ],
                        }
                    ]
                }
            )
        }).catch(err => PassThrough);


        if(fs.readFileSync("./DataBase/requests.txt", "utf8")!="0") { // BOT WAS RESPONDING
            fetch(URL, { // BOT WAS RESPONDING
                "method":"POST",
                "headers": {"Content-Type": "application/json"},
                "body": JSON.stringify(
                    {
                        "username": `${config["BotInfo"]["name"]} Logs`,
                        "avatar_url": `${config["BotInfo"]["IconURL"]}`,
                        "embeds": [
                            {
                            "title": "__Bot was Responding to a Request__",
                            "color": 14846976,
                            "timestamp": new Date(),
                            "author": {
                                "name": `${config["BotInfo"]["name"]}`,
                                "icon_url": `${config["BotInfo"]["IconURL"]}`,
                            },
                            "fields": [
                                {
                                "name": `Requests`,
                                "value": `${fs.readFileSync("./DataBase/requests.txt", "utf8")}`,
                                "inline": false
                                }
                            ],
                            }
                        ]
                    }
                )
            }).catch(err => PassThrough);
            fs.writeFile("./DataBase/requests.txt", `0`, (err) => {
                if (err) console.error();
            })
        }
        


        console.log("Connected")
        console.log(`🛠 ${config["BotInfo"]["name"]} has started 🛠`)
    }
}