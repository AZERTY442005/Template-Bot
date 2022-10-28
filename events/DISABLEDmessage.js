const fs = require("fs");

module.exports = {
    name: "DISABLEDmessage",
    execute(message) {
        // let DATAS = JSON.parse(fs.readFileSync("./DataBase/DATAS.json", "utf8")); // DATAS SETUP
        if (message.author.bot) return;
        if (message.guild == null) {
            message.author.send(
                "Désolé, je ne suis pas compatible avec les messages privées"
            );
            return;
        }
        if (message.channel.type == "dm" || message.channel.type === "group")
            return;
        if (message.channel == null) return;

        let prefixes = JSON.parse(
            fs.readFileSync("./DataBase/prefixes.json", "utf8")
        );

        let join_message_status = JSON.parse(
            fs.readFileSync("./DataBase/join-message-status.json", "utf8")
        );
        if (!join_message_status[message.guild.id]) {
            // If join_message_status is not defined for the server
            join_message_status[message.guild.id] = {
                join_message_status: "off",
            };
            fs.writeFile(
                "./DataBase/join-message-status.json",
                JSON.stringify(join_message_status),
                (err) => {
                    if (err) console.error();
                }
            );
        }

        if (!prefixes[message.guild.id]) {
            // If prefix is not defined for the server
            prefixes[message.guild.id] = {
                prefixes: "²",
            };
            fs.writeFile(
                "./DataBase/prefixes.json",
                JSON.stringify(prefixes),
                (err) => {
                    if (err) console.error();
                }
            );
        }

        const prefix = prefixes[message.guild.id].prefixes;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const command = args
            .shift()
            .toLowerCase()
            .slice(message.length - prefix.length);

        if (
            fs.readFileSync("./DataBase/status.txt", "utf8") == "off" &&
            command != "owner"
        )
            return;

        let UserMention = message.mentions.users.first();
        if (
            UserMention != null &&
            UserMention.id == BotInfo["ID"] &&
            "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".includes(
                message.content.slice(0, 1)
            )
        ) {
            // If the bot is mentioned
            message.channel.send(
                `Oui c'est moi ? Pour information mon préfix est **${prefix}**`
            );
        }

        if (message.content.startsWith(prefix)) {
            // Command detected
            // if(!DATAS["commands"]) DATAS["commands"]=0
            // DATAS["commands"] = DATAS["commands"] + 1
            // fs.writeFile("./DataBase/DATAS.json", JSON.stringify(DATAS), (err) => {
            //     if (err) console.error();
            // });
            let blacklist = JSON.parse(
                fs.readFileSync("./DataBase/blacklist.json", "utf8")
            );
            if (blacklist.includes(message.author.id)) {
                message.delete();
                message.author.send(
                    `Oups!!! On dirait que tu as été blacklisté, tu ne peux donc pas utiliser mes commandes.\nSi tu penses que c'est une erreur, contacte mon développeur.`
                );
                return;
            }

            if (
                commandedRecently.has(message.author.id) &&
                !message.member.hasPermission("ADMINISTRATOR")
            ) {
                // Command Cooldown
                message.lineReply(
                    "Veuillez attendre 3 secondes entre chaques commandes"
                );
            } else {
                if (!bot.commands.has(command)) return; // message.lineReply("Erreur: Cette commande n'existe pas");

                argsresult = args.join(" ");
                var URL = fs.readFileSync(
                    "./DataBase/webhook-logs-url.txt",
                    "utf8"
                ); // Webhook Logs System
                fetch(URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: `${BotInfo["name"]} Logs`,
                        avatar_url: `${BotInfo["IconURL"]}`,
                        embeds: [
                            {
                                title: "__Command executed__",
                                color: 15258703,
                                timestamp: new Date(),
                                author: {
                                    name: `${message.author.username}`,
                                    icon_url: `${message.author.displayAvatarURL()}`,
                                },
                                fields: [
                                    {
                                        name: "User",
                                        value: `${message.author}`,
                                        inline: false,
                                    },
                                    {
                                        name: "Server",
                                        value: `${message.guild.name}`,
                                        inline: false,
                                    },
                                    {
                                        name: "Command",
                                        value: `${prefix}${command} ${argsresult}`,
                                        inline: false,
                                    },
                                ],
                            },
                        ],
                    }),
                }).catch((err) => PassThrough);

                if (!message.guild.me.hasPermission("ADMINISTRATOR"))
                    return message.lineReply(
                        `Je ne possède pas les permissions d'Administrateur\nPour profiter des fonctionnalitées, veuillez les activer`
                    );

                bot.commands
                    .get(command)
                    .execute(
                        message,
                        args,
                        Discord.Guild,
                        BotInfo,
                        token,
                        prefix,
                        prefixes,
                        bot,
                        bot.prefix,
                        bot.user.id
                    );

                commandedRecently.add(message.author.id);
                setTimeout(() => {
                    commandedRecently.delete(message.author.id);
                }, 3000);
            }
        } else {
            // if(!DATAS["messages"]) DATAS["messages"]=0
            // DATAS["messages"] = DATAS["messages"] + 1
            // fs.writeFile("./DataBase/DATAS.json", JSON.stringify(DATAS), (err) => {
            //     if (err) console.error();
            // });

            // XP SYSTEM
            let xp_system = JSON.parse(
                fs.readFileSync("./DataBase/xp-system.json", "utf8")
            );
            if (!xp_system["status"]) xp_system["status"] = {};
            if (!xp_system["status"][message.guild.id]) {
                xp_system["status"][message.guild.id] = "on";
            }
            if (!xp_system["messages"]) xp_system["messages"] = {};
            if (!xp_system["messages"][message.guild.id])
                xp_system["messages"][message.guild.id] = {};
            if (!xp_system["messages"][message.guild.id][message.author.id]) {
                xp_system["messages"][message.guild.id][message.author.id] = 0;
            }
            if (!xp_system["levels"]) xp_system["levels"] = {};
            if (!xp_system["levels"][message.guild.id])
                xp_system["levels"][message.guild.id] = {};
            if (!xp_system["levels"][message.guild.id][message.author.id]) {
                xp_system["levels"][message.guild.id][message.author.id] = 0;
            }
            if (!xp_system["total-messages"]) xp_system["total-messages"] = {};
            if (!xp_system["total-messages"][message.guild.id])
                xp_system["total-messages"][message.guild.id] = {};
            if (
                !xp_system["total-messages"][message.guild.id][
                    message.author.id
                ]
            ) {
                xp_system["total-messages"][message.guild.id][
                    message.author.id
                ] = 0;
            }

            var times = 10;
            let temp = 10;
            let levels_requirments = [];
            for (var i = 0; i < times; i++) {
                // GET LEVELS REQUIRMENTS
                levels_requirments.push(Math.floor(temp));
                temp = temp * 1.5;
            }

            if (
                !talkedRecently.has(message.author.id) &&
                xp_system["status"][message.guild.id] == "on"
            ) {
                // MESSAGE XP COOLDOWN
                xp_system["messages"][message.guild.id][message.author.id] =
                    xp_system["messages"][message.guild.id][message.author.id] +
                    1;
                xp_system["total-messages"][message.guild.id][
                    message.author.id
                ] =
                    xp_system["total-messages"][message.guild.id][
                        message.author.id
                    ] + 1;

                talkedRecently.add(message.author.id);
                setTimeout(() => {
                    // Removes the user from the set after a minute
                    talkedRecently.delete(message.author.id);
                }, 2000);
            }
            if (
                xp_system["messages"][message.guild.id][message.author.id] >=
                    levels_requirments[
                        xp_system["levels"][message.guild.id][message.author.id]
                    ] &&
                xp_system["levels"][message.guild.id][message.author.id] < 10
            ) {
                xp_system["levels"][message.guild.id][message.author.id] =
                    xp_system["levels"][message.guild.id][message.author.id] +
                    1;
                xp_system["messages"][message.guild.id][message.author.id] = 0;
                if (
                    xp_system["levels"][message.guild.id][message.author.id] !=
                    10
                ) {
                    message.channel.send(
                        `GG ${message.author}, tu es passé au **niveau ${
                            xp_system["levels"][message.guild.id][
                                message.author.id
                            ]
                        }** !!!\nIl te faut maintenant écrire **${
                            levels_requirments[
                                xp_system["levels"][message.guild.id][
                                    message.author.id
                                ]
                            ]
                        } messages**`
                    );
                } else {
                    message.channel.send(
                        `GG ${message.author}, tu es passé au **niveau ${
                            xp_system["levels"][message.guild.id][
                                message.author.id
                            ]
                        }** !!! ** Niveau MAX**`
                    );
                }
            }
            fs.writeFile(
                "./DataBase/xp-system.json",
                JSON.stringify(xp_system, null, 4),
                (err) => {
                    if (err) console.error();
                }
            );

            // AUTO-REACT SYSTEM
            let auto_react = JSON.parse(
                fs.readFileSync("./DataBase/auto-react.json", "utf8")
            );
            if (!auto_react[message.guild.id]) {
                auto_react[message.guild.id] = {
                    auto_react: "off",
                };
                fs.writeFile(
                    "./DataBase/auto-react.json",
                    JSON.stringify(auto_react),
                    (err) => {
                        if (err) console.error();
                    }
                );
            }
            if (auto_react[message.guild.id].auto_react != "on") return;
            if (message.content in autoreacts) {
                message.react(autoreacts[message.content]);
            }
        }

        if (!message.member.hasPermission("ADMINISTRATOR")) {
            // Badwords detector
            let confirm = false;
            var i;
            for (i = 0; i < badwords.length; i++) {
                if (
                    message.content
                        .toLowerCase()
                        .includes(badwords[i].toLowerCase())
                )
                    confirm = true;
                const word = badwords[i];
            }
            if (confirm) {
                let warns = JSON.parse(
                    fs.readFileSync("./DataBase/warns.json", "utf8")
                );
                if (!warns[message.guild.id]) warns[message.guild.id] = {};
                if (!warns[message.guild.id][message.author.id]) {
                    warns[message.guild.id][message.author.id] = {
                        warns: 0,
                    };
                    fs.writeFile(
                        "./DataBase/warns.json",
                        JSON.stringify(warns),
                        (err) => {
                            if (err) console.error();
                        }
                    );
                }
                message.delete().catch((error) => {
                    console.error("Badwords Deletion: " + error);
                });
                // let UserWarn = message.author.id
                UserWarns = parseInt(
                    warns[message.guild.id][message.author.id].warns
                );
                const ReasonWarn = `Bad words: ${message.content}`;
                let AvatarWarn = message.author.displayAvatarURL();
                //let ChannelWarn = message.guild.channels.cache.find(channel => channel.name === "warns")
                let EmbedWarn = new MessageEmbed()
                    .setTitle(`WARN`)
                    .setDescription(``)
                    .setColor("ORANGE")
                    .setThumbnail(AvatarWarn)
                    .addFields(
                        {
                            name: "Mod Name",
                            value: `<@${BotInfo["ID"]}>`,
                            inline: true,
                        },
                        {
                            name: "Warned Name",
                            value: `<@${message.author.id}>`,
                            inline: true,
                        },
                        {
                            name: "Reason",
                            value: `${ReasonWarn}`,
                            inline: true,
                        },
                        // {name:"Mod ID",value:`${BotInfo["ID"]}`,inline:true},
                        // {name:"Warned ID",value:`${message.author.id}`,inline:true},
                        {
                            name: "Date (M/D/Y)",
                            value: `${new Intl.DateTimeFormat("en-US").format(
                                Date.now()
                            )}`,
                            inline: true,
                        }
                    )
                    .setTimestamp();
                message.channel.send(EmbedWarn);
                warns[message.guild.id][message.author.id] = {
                    warns: UserWarns + 1,
                };
                fs.writeFile(
                    "./DataBase/warns.json",
                    JSON.stringify(warns),
                    (err) => {
                        if (err) console.error();
                    }
                );
            }
        }
    },
};
