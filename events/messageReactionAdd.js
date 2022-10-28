const { Message } = require('discord.js');
const fs = require('fs')
const {format: prettyFormat} = require('pretty-format');

module.exports = {
    name: 'messageReactionAdd',
    execute(messageReaction, user)  {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        if(config["DEBUG"]) {
            console.log("messageReactionAdd")
            console.log(messageReaction.emoji.name)
            console.log(user.username)
        }
    }
}