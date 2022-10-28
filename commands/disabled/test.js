module.exports = {
    name: '/test',
    description: "Just a test...",
    execute(message, args) {
        message.channel.send("test coucou")
    },
};