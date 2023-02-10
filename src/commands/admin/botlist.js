const {ApplicationCommandOptionType, ChannelType} = require("discord.js");
const AddBot = require("../../../models/AddBot");
const VerifyBot = require("../../../models/VerifyBot");
const BotLog = require("../../../models/BotLog");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "botlist",
    description: "enable or disable botlist system",
    category: "ADMIN",
    userPermissions: ["ManageGuild"],
    command: {
        enabled: true,
        usage: "<#channel|off>",
        minArgsCount: 1,
    },
    slashCommand: {
        enabled: true,
        ephemeral: true,
        options: [
            {
                name: "addchannel",
                description: "channels to send mod logs",
                required: true,
                type: ApplicationCommandOptionType.Channel,
                channelTypes: [ChannelType.GuildText],
            },
            {
                name: "logchannel",
                description: "channels to send mod logs",
                required: true,
                type: ApplicationCommandOptionType.Channel,
                channelTypes: [ChannelType.GuildText],
            },
            {
                name: "requestchannel",
                description: "channels to send mod logs",
                required: true,
                type: ApplicationCommandOptionType.Channel,
                channelTypes: [ChannelType.GuildText],
            },
        ],
    },

    async messageRun(message, args, data) {
        const input = args[0].toLowerCase();
        let targetChannel;

        if (input === "none" || input === "off" || input === "disable") targetChannel = null;
        else {
            if (message.mentions.channels.size === 0) return message.safeReply("Incorrect command usage");
            targetChannel = message.mentions.channels.first();
        }

        const response = await (targetChannel, data.settings);
        return message.safeReply(response);
    },

    async interactionRun(interaction, data) {

        const addchannel = interaction.options.getChannel("addchannel")
        const logchannel = interaction.options.getChannel("logchannel")
        const requestchannel = interaction.options.getChannel("requestchannel")

        if (await AddBot.findOne({GuildID: interaction.guildId})) {

            await AddBot.findOneAndUpdate({

                GuildID: interaction.guildId,
                ChannelID: addchannel.id

            })

        } else {

            await AddBot.create({

                GuildID: interaction.guildId,
                ChannelID: addchannel.id

            })

            await AddBot.update({

                ChannelID: addchannel.id

            })

        }


        if (await VerifyBot.findOne({GuildID: interaction.guildId})) {

            await VerifyBot.findOneAndUpdate({

                GuildID: interaction.guildId,
                ChannelID: requestchannel.id

            })

        } else {

            await VerifyBot.create({

                GuildID: interaction.guildId,
                ChannelID: requestchannel.id

            })

            await VerifyBot.update({

                ChannelID: requestchannel.id

            })

        }

        if (await BotLog.findOne({GuildID: interaction.guildId})) {

            await BotLog.findOneAndUpdate({

                GuildID: interaction.guildId,
                ChannelID: logchannel.id

            })

        } else {

            await BotLog.create({

                GuildID: interaction.guildId,
                ChannelID: logchannel.id

            })

            await BotLog.update({

                ChannelID: logchannel.id

            })

        }

        return interaction.followUp("Channel setted");
    },
};
