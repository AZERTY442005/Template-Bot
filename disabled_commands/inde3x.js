const Discord = require('discord.js');
const client = new Discord.Client();
const token = "OTI3MjEyNDA4ODE1MTA4MTM2.YdG72Q.Yn8teEGK6Wb87JL-oVVSzTTqrb0"

client.on('ready', () => {
   console.log('Félicitations, votre bot Discord a été correctement initialisé !');
});

client.on("message", message => {
    if (message.content === "!ping") {
      message.channel.send("Pong.")
    }
  })

client.login(token);