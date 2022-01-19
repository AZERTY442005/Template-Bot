const Discord = require("discord.js")

module.exports.run = async (bot, message, args) => {
    if(!message.member.hasPermission("MANAGE_ROLES")) return message.channel.send("ERREUR: Vous n'avez pas la permission de faire ceci!")
    let rMember = message.guild.member(message.mentions.users.first()) || message.guild.members.get(args[0])
    await(rMember.addRole("784549811046842368"))
    console.log("GIVEN")
}

module.exports.help = {
    name: "addrole"
}