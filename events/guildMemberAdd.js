const fs = require('fs')

module.exports = {
    name: 'guildMemberAdd',
    execute(member)  {
        let join_message_status = JSON.parse(fs.readFileSync("./DataBase/join-message-status.json", "utf8"))
        let join_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/join-message-channel-id.json", "utf8"))
        if(join_message_status[member.guild.id].join_message_status == "on") {
            const join_message = `Welcome <@${member.id}> to the server`
            const channel = member.guild.channels.cache.get(join_message_channel_id[member.guild.id].join_message_channel_id)
            channel.send(join_message)
        }
    }
}