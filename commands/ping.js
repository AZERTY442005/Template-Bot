module.exports = {
    name: 'ping',
    description: "Me fait écrire pong",
    execute(message) {
        message.channel.send("Calculating ping...").then((resultMessage) => {
            const ping = resultMessage.createdTimestamp - message.createdTimestamp
            message.lineReply(`Pong !!! **${ping}ms**`)
        })
    }
}