module.exports = {
    name: 'clear2',
    description: "Supprime des messages",
    execute(message, args) {
        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return message.channel
              .send(
                "You cant use this command since you're missing `manage_messages` perm",
              );
          }
      
          if (isNaN(args[0])) {
            return message.channel
              .send('enter the amount of messages that you would like to clear')
              .then((sent) => {
                setTimeout(() => {
                  sent.delete();
                }, 2500);
              });
          }
      
          if (Number(args[0]) < 0) {
            return message.channel
              .send('enter a positive number')
              .then((sent) => {
                setTimeout(() => {
                  sent.delete();
                }, 2500);
              });
          }
      
          // add an extra to delete the current message too
          const amount = Number(args[0]) > 100
            ? 101
            : Number(args[0]) + 1;
      
          message.channel.bulkDelete(amount, true)
          .then((_message) => {
            message.channel
              .send(`:broom: \`${_message.size}\` messages supprimés`)
              .then((sent) => {
                setTimeout(() => {
                  sent.delete();
                }, 2500);
              });
          });
        }
    }
