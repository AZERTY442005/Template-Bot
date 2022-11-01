const { MessageEmbed } = require("discord.js")
const moment = require('moment');
const fs = require('fs')
const fetch = require('node-fetch');
const UserError = require("../Functions/UserError.js")

module.exports = {
    name: 'userinfo',
    description: {"fr": "Affiche les infos d'un utilisateur", "en": "Show user info"},
    aliases: [],
    usage: "userinfo <user>",
    category: "Utility",
    execute(message, args, bot) {
        let config = JSON.parse(fs.readFileSync("./config.json", "utf8"));
        try {
            if(!message.mentions.users.first()) return UserError("SpecifyUser", bot, message, __filename)
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
            message.channel.send(embed);
        } catch (error) { // ERROR PREVENTER
            console.error(`${error}`)
            Embed = new MessageEmbed()
            .setTitle(`${message_language[languages[message.guild.id]]["ErrorPreventer"]}`)
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setColor("RED")
            message.lineReplyNoMention(Embed)
            var URL = fs.readFileSync("./DataBase/webhook-logs-url.txt", "utf8")
            fetch(URL, {
                "method":"POST",
                "headers": {"Content-Type": "application/json"},
                "body": JSON.stringify(
                    {
                        "username": `${config["BotInfo"]["name"]} Logs`,
                        "avatar_url": `${config["BotInfo"]["IconURL"]}`,
                        "embeds": [
                        {
                            "title": "__Error__",
                            "color": 15208739,
                            "timestamp": new Date(),
                            "author": {
                                "name": `${message.author.username}`,
                                "icon_url": `${message.author.displayAvatarURL()}`,
                            },
                            "fields": [
                                {
                                "name": `User`,
                                "value": `${message.author}`,
                                "inline": false
                                },
                                {
                                    "name": "Server",
                                    "value": `${message.guild.name}`,
                                    "inline": false
                                },
                                {
                                "name": `Command`,
                                "value": `${message.content}`,
                                "inline": false
                                },
                                {
                                "name": `Error`,
                                "value": `${error}`,
                                "inline": false
                                }
                            ],
                        }
                        ]
                    }
                )
            })
            .catch(err => PassThrough);
        }
    }
}