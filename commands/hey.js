module.exports = {
    name: 'hey',
    description: "Te répond hey!!!",
    execute(message, prefix, token, bot) {
        // message.react("👋")
        message.channel.send(`hey <@${message.author.id}>!!!`);
        // console.log("HEY PREFIX: '"+prefix+"'")
        // console.log("HEY PREFIX2: '"+bot.prefix+"'")
        // console.log("HEY TOKEN: '"+token+"'")
    }
}