module.exports = {
    name: 'guildCreate',
    execute(guild) {
        const channel = guild.channels.cache.find(channel => channel.type === 'text' && channel.permissionsFor(guild.me).has('SEND_MESSAGES'))
        channel.send("Thanks for inviting me")
    }
}