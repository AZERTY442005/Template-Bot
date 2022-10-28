const fs = require('fs')

module.exports = {
    name: 'guildMemberRemove',
    execute(member)  {
        let leave_message_status = JSON.parse(fs.readFileSync("./DataBase/leave-message-status.json", "utf8"))
        let leave_message_channel_id = JSON.parse(fs.readFileSync("./DataBase/leave-message-channel-id.json", "utf8"))
        if(!leave_message_status[member.guild.id]) {
            leave_message_status[member.guild.id] = {
                leave_message_status: "off"
            }
            fs.writeFile("./DataBase/leave-message-status.json", JSON.stringify(leave_message_status), (err) => {
                if (err) console.error();
            });
        }
        if(leave_message_status[member.guild.id].leave_message_status == "on") {
            const leave_message = `Bye <@${member.id}>`
            const channel = member.guild.channels.cache.get(leave_message_channel_id[member.guild.id].leave_message_channel_id)
            channel.send(leave_message)
        }
    }
}