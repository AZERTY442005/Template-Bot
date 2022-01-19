module.exports = {
    name: 'addrole',
    description: "Controle des roles",
    execute(message, args) {
        if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("ERREUR: Vous n'avez pas la permission de faire ceci!")
        let rMember = message.mentions.users.first()
        if(!rMember) return message.reply("ERREUR: Utilisateur introuvable");
        let role = args.join(" ").slice(22);
        if(!role) return message.reply("ERREUR: Veuillez préciser un rôle");
        let gRole = message.guild.roles.cache.find(`member`, role);
        if(!gRole) return message.reply("ERREUR: Rôle introuvable");

        if(rMember.roles.has(gRole.id)) return message.reply("They already have that role.");
        rMember.addRole(gRole.id)

        try{
            rMember.send(`Congrats, you have been given the role ${gRole.name}`)
        }catch(e){
            message.channel.send(`Congrats to <@${rMember.id}>, they have been given the role ${gRole.name}. We tried to DM them, but their DMs are locked.`)
        }
    }
}