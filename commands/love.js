const {format: prettyFormat} = require('pretty-format');

module.exports = {
    name: 'love',
    description: "Fait rencontrer 2 membres",
    execute(message, args, bot) {
        // console.log(prettyFormat(message.guild.members))
        // const list = bot.guilds.cache.get(message.guild.id);
        const MembersList = []
        message.guild.members.cache.forEach(member => {
            if(!member.user.bot) MembersList.push(member.user)
        });
        // console.log(prettyFormat(MembersList))
        if(MembersList.length==1) return message.lineReply("Erreur: Vous êtes seul 😓")
        // console.log("RANDOM1 "+Math.random())
        // console.log("RANDOM2 "+Math.random())
        // console.log("RANDOM3 "+Math.random())
        const members = {
            "member1": MembersList[Math.floor(Math.random() * (MembersList.length))],
            "member2": MembersList[Math.floor(Math.random() * (MembersList.length))],
        }
        // console.log("R member: "+Math.floor(Math.random() * (MembersList.length)))
        // const member2 = MembersList[Math.floor(Math.random() * (MembersList.length))]
        while(members["member1"]==members["member2"]) {
            members.member2 = MembersList[Math.floor(Math.random() * (MembersList.length - 1) + 1)]
        }
        message.channel.send("<@"+members["member1"].id+"> ❤ <@"+members["member2"].id+">")
    }
}