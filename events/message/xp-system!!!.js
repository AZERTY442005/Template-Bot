const fs = require("fs");
const talkedRecently = new Set();

module.exports = {
    name: "message!!!",
    execute(message) {
        if(message.author.bot) return;
        if(message.guild == null) return
        if(message.channel.type == "dm"||message.channel.type==="group") return;
        if(message.channel == null) return;    
        
        // VAR PREFIXES
        let prefixes = JSON.parse(fs.readFileSync("./DataBase/prefixes.json", "utf8"));
        if(!prefixes[message.guild.id]) { // If prefix is not defined for the server
            prefixes[message.guild.id] = {
                prefixes: `${JSON.parse(fs.readFileSync("./config.json", "utf8"))["DefaultPrefix"]}`,
            }
            fs.writeFile("./DataBase/prefixes.json", JSON.stringify(prefixes), (err) => {
                if (err) console.error();
            })
        }
        const prefix = prefixes[message.guild.id].prefixes;
    
        // IF BOT IS DISABLED
        if(fs.readFileSync("./DataBase/status.txt", "utf8")=="off" && command!="owner") return

        // XP SYSTEM
        let xp_system = JSON.parse(fs.readFileSync("./DataBase/xp-system.json", "utf8"))
        if(!xp_system["status"]) xp_system["status"] = {}
        if(!xp_system["status"][message.guild.id]) {
            xp_system["status"][message.guild.id] = `${JSON.parse(fs.readFileSync("./config.json", "utf8"))["DefaultXPStatus"]}`
        }
        if(!xp_system["messages"]) xp_system["messages"] = {}
        if(!xp_system["messages"][message.guild.id]) xp_system["messages"][message.guild.id] = {}
        if(!xp_system["messages"][message.guild.id][message.author.id]) {
            xp_system["messages"][message.guild.id][message.author.id] = 0
        }
        if(!xp_system["levels"]) xp_system["levels"] = {}
        if(!xp_system["levels"][message.guild.id]) xp_system["levels"][message.guild.id] = {}
        if(!xp_system["levels"][message.guild.id][message.author.id]) {
            xp_system["levels"][message.guild.id][message.author.id] = 0
        }
        if(!xp_system["total-messages"]) xp_system["total-messages"] = {}
        if(!xp_system["total-messages"][message.guild.id]) xp_system["total-messages"][message.guild.id] = {}
        if(!xp_system["total-messages"][message.guild.id][message.author.id]) {
            xp_system["total-messages"][message.guild.id][message.author.id] = 0
        }
        var times = 10;
        let temp = 10
        let levels_requirments = []
        for(var i = 0; i < times; i++){ // GET LEVELS REQUIRMENTS
            levels_requirments.push(Math.floor(temp))
            temp = temp * 1.5
        }
        if (!talkedRecently.has(message.author.id) && xp_system["status"][message.guild.id]=="on") { // MESSAGE XP COOLDOWN
            xp_system["messages"][message.guild.id][message.author.id] = xp_system["messages"][message.guild.id][message.author.id] + 1
            xp_system["total-messages"][message.guild.id][message.author.id] = xp_system["total-messages"][message.guild.id][message.author.id] + 1

            talkedRecently.add(message.author.id);
            setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(message.author.id);
            }, 2000);}
        if(xp_system["messages"][message.guild.id][message.author.id] >= levels_requirments[xp_system["levels"][message.guild.id][message.author.id]] && xp_system["levels"][message.guild.id][message.author.id] < 10) {
            xp_system["levels"][message.guild.id][message.author.id] = xp_system["levels"][message.guild.id][message.author.id] + 1
            xp_system["messages"][message.guild.id][message.author.id] = 0
            if(xp_system["levels"][message.guild.id][message.author.id]!=10) {
                message.channel.send(`GG ${message.author}, tu es passé au **niveau ${xp_system["levels"][message.guild.id][message.author.id]}** !!!\nIl te faut maintenant écrire **${levels_requirments[xp_system["levels"][message.guild.id][message.author.id]]} messages**`)
            } else {
                message.channel.send(`GG ${message.author}, tu es passé au **niveau ${xp_system["levels"][message.guild.id][message.author.id]}** !!! ** Niveau MAX**`)
            }
        }
        fs.writeFile("./DataBase/xp-system.json", JSON.stringify(xp_system, null, 4), (err) => {
            if (err) console.error();
        });
    },
};
