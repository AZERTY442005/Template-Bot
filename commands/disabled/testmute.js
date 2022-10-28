module.exports.run = async (bot, message, args) => {
    console.log("mute")
    let user = message.guild.member(message.mentions.users.first())
    let muteRole = message.guild.roles.cache.find(r => r.name === 'muted')

    if (!muteRole) {
        muteRole = await message.guild.roles.create({
            data: {
                name: 'muted',
                color: '#000',
                permissions: []
            }
        })
    }
}

module.exports.help = {
    name: "mute",
    aliases: ['testmute'],
    description: "Mute un utilisateur",
    cooldown: 10,
    usage: '<user> <reason>',
    isUserAdmin: true,
    permissions: true,
    args: true
}