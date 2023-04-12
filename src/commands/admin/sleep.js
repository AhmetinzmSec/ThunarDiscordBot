const {ApplicationCommandOptionType} = require("discord.js");
const SleepingBot = require("../../../models/BotSleep");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "sleep",
    description: "put Thunar to sleep",
    category: "ADMIN",
    userPermissions: ["ManageGuild"],
    command: {
        enabled: true,
        aliases: ["sm"],
        minArgsCount: 1,
        usage: "<on|off>",
    },
    slashCommand: {
        enabled: true,
        ephemeral: true,
    },

    async messageRun(message, args, data) {
        const status = args[0].toLowerCase();
        if (!["on", "off"].includes(status)) return message.safeReply("Invalid status. Value must be `on/off`");

        const response = await (status, data.settings);
        await message.safeReply(response);
    },

    async interactionRun(interaction, data) {

        if (await SleepingBot.findOne({GuildID: interaction.guildId})) {

            interaction.followUp("Bot is already asleep on this server. You can use `/wake` command to wake Thunar");
            return;

        } else {

            await SleepingBot.create({GuildID: interaction.guildId});
            interaction.followUp("Thunar goes into sleep mode...");

        }

    },
};
