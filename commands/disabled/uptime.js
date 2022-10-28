const { runtimeConfig } = require("solid-js")
const ms = require('ms');

module.exports = {
    name: 'uptime',
    description: "Me fait écrire pong",
    execute(message, args, bot) {
        message.channel.send(`My uptime is \`${ms(this.bot.uptime, {long: true})}\``) // ERROR
    }
}