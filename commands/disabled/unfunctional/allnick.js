module.exports = {
    name: '/allnick',
    description: "Change le pseudo de tous les utilisateurs",
    execute(message, args, prefix) {
        const name = args.slice((prefix + "allnick").lenght)
        message.guild.members.array.forEach(element => {
            
        });(r=>r.setNickname(name + r.user.username))
    }
}