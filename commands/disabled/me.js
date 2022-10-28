module.exports = {
    name: '/me',
    description: "Je te dis qui tu es",
    execute(message, args) {
        message.channel.send('You are ' + message.author.username);
    }
}