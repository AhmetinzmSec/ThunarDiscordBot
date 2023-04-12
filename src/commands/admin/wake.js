const {ApplicationCommandOptionType} = require("discord.js");
const SleepingBot = require("../../../models/BotSleep");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "wake",
    description: "put Thunar to sleep",
    category: "ADMIN",
    userPermissions: ["ManageGuild"],
    command: {
        enabled: true,
        aliases: ["wm"],
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

            await SleepingBot.deleteOne({GuildID: interaction.guildId});
            interaction.followUp("Thunar awakens...");
            return;

        } else {

            interaction.followUp("The bot is already active. You can use `/sleep` command to sleep Thunar");
            return;

        }

    },
};
