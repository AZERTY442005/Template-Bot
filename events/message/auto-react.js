const fs = require("fs");
const autoreacts = { // Auto-react LIST
    "hey": "👋",
    "salut": "👋",
    "slt": "👋",
    "cc": "👋",
    "mdr": "😂",
}

module.exports = {
    name: "message",
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

        // AUTO-REACT SYSTEM
        let auto_react = JSON.parse(fs.readFileSync("./DataBase/auto-react.json", "utf8"))
        if(!auto_react[message.guild.id]) {
            auto_react[message.guild.id] = {
                auto_react: `${JSON.parse(fs.readFileSync("./config.json", "utf8"))["DefaultAutoReactStatus"]}`
            }
            fs.writeFile("./DataBase/auto-react.json", JSON.stringify(auto_react), (err) => {
                if (err) console.error();
            });
        }
        if(auto_react[message.guild.id].auto_react!="on") return
        if(message.content in autoreacts){
            message.react(autoreacts[message.content])
        }
    },
};
