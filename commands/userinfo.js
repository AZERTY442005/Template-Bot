const { MessageEmbed } = require("discord.js")
const moment = require('moment');

module.exports = {
    name: 'userinfo',
    description: "affiche les infos d'un utilisateur",
    execute(message, args) {
        if(!message.mentions.users.first()) return message.lineReply("Erreur: Veuillez préciser un utilisateur\n*userinfo <user>*")
        const flags = {
            DISCORD_EMPLOYEE: 'Discord Employee',
            DISCORD_PARTNER: 'Discord Partner',
            BUGHUNTER_LEVEL_1: 'Bug Hunter (Level 1)',
            BUGHUNTER_LEVEL_2: 'Bug Hunter (Level 2)',
            HYPESQUAD_EVENTS: 'HypeSquad Events',
            HOUSE_BRAVERY: 'House of Bravery',
            HOUSE_BRILLIANCE: 'House of Brilliance',
            HOUSE_BALANCE: 'House of Balance',
            EARLY_SUPPORTER: 'Early Supporter',
            TEAM_USER: 'Team User',
            SYSTEM: 'System',
            VERIFIED_BOT: 'Verified Bot',
            VERIFIED_DEVELOPER: 'Verified Bot Developer'
        };
        const member = message.mentions.members.last() || message.guild.members.cache.get(target) || message.member;
        const roles = member.roles.cache
            .sort((a, b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1);
        const userFlags = member.user.flags.toArray();
        const embed = new MessageEmbed()
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
            .setColor(member.displayHexColor || 'BLUE') 
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setTimestamp()
            // .setColor("#7289DA")
            .addField('__Utilisateur__', [
                `**Nom d'utilisateur:** ${member.user.username}`,
                `**Hashtag:** #${member.user.discriminator}`,
                `**ID:** ${member.id}`,
                `**Flags:** ${userFlags.length ? userFlags.map(flag => flags[flag]).join(', ') : 'None'}`,
                `**Avatar:** [Link to avatar](${member.user.displayAvatarURL({ dynamic: true })})`,
                `**Créé le:** ${moment(member.user.createdTimestamp).format('LT')} ${moment(member.user.createdTimestamp).format('LL')} ${moment(member.user.createdTimestamp).fromNow()}`,
               `**Status:** ${member.user.presence.status}`,
               `**Game:** ${member.user.presence.game || 'Not playing a game.'}`,
                `\u200b`
            ])
            .addField('__Membre__', [
                `**Plus grand rôle:** ${member.roles.highest.id === message.guild.id ? 'None' : member.roles.highest.name}`,
                `**Rejoin le:** ${moment(member.joinedAt).format('LL LTS')}`,
                `**Rôle d'affichage:** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
                `**Rôles [${roles.length}]:** ${roles.length < 10 ? roles.join(', ') : roles.length > 10 ? this.client.utils.trimArray(roles) : 'None'}`,
                `\u200b`
            ]);
        return message.channel.send(embed);
    }
}