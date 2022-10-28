const fs = require('fs')
const fetch = require('node-fetch');

module.exports = {
    name: 'mute',
    description: "Mute quelqu'un",
    execute(message, args) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            let CheckRole = message.guild.roles.cache.find(role => role.name === "new role");

            if(!CheckRole) message.guild.roles.create({name:"new role", color: "818386", mentionable: false, permissions:[]});
            let myRole = message.guild.roles.cache.find(role => role.name === "new role");
            



            // get role by ID
            // let myRole = message.guild.roles.cache.get("264410914592129025");

            // get role by name
            // let myRole = message.guild.roles.cache.find(role => role.name === "Moderators");

            // Add role to a member
            // member.roles.add(role).catch(console.error);
            // member.roles.remove(role).catch(console.error);

            // assuming role.id is an actual ID of a valid role:
            // if (message.member.roles.cache.has(role.id)) {
            //     console.log("Yay, the author of the message has the role!");
            // }
            // else {
            //     console.log("Nope, noppers, nadda.");
            // }

            // Check if they have one of many roles
            // if (message.member.roles.cache.some(r=>["Dev", "Mod", "Server Staff", "Proficient"].includes(r.name)) ) {
            //     // has one of the roles
            // }
            // else {
            //     // has none of the roles
            // }
        } catch (error) { // ERROR PREVENTER
            console.error(`${error}`)
            message.lineReply(`Une erreur est survenue`)
            var URL = fs.readFileSync("./DataBase/webhook-logs-url", "utf8")
            fetch(URL, {
                "method":"POST",
                "headers": {"Content-Type": "application/json"},
                "body": JSON.stringify(
                    {
                        "username": `${config["BotInfo"]["name"]} Logs`,
                        "avatar_url": `${config["BotInfo"]["IconURL"]}`,
                        "embeds": [
                        {
                            "title": "__Error__",
                            "color": 15208739,
                            "author": {
                                "name": `${message.author.username}`,
                                "icon_url": `${message.author.displayAvatarURL()}`,
                            },
                            "fields": [
                                {
                                "name": `User`,
                                "value": `${message.author}`,
                                "inline": false
                                },
                                {
                                    "name": "Server",
                                    "value": `${message.guild.name}`,
                                    "inline": false
                                },
                                {
                                "name": `Command`,
                                "value": `${message.content}`,
                                "inline": false
                                },
                                {
                                "name": `Error`,
                                "value": `${error}`,
                                "inline": false
                                }
                            ],
                        }
                        ]
                    }
                )
            })
            .catch(err => PassThrough);
        }
    }
}