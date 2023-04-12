const {getSettings} = require("@schemas/Guild");
const {commandHandler, contextHandler, statsHandler, suggestionHandler, ticketHandler} = require("@src/handlers");
const {InteractionType, EmbedBuilder} = require("discord.js");
const Press = require("../../../models/Supress");
const Sleep = require("../../../models/BotSleep");

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').BaseInteraction} interaction
 */
module.exports = async (client, interaction) => {
    if (!interaction.guild) {
        return interaction
            .reply({content: "Command can only be executed in a discord server", ephemeral: true})
            .catch(() => {
            });
    }

    // Karaliste

    if (await Press.findOne(
        {
            UserID: interaction.member.id,
        })) {

        let getUser = await Press.findOne({UserID: interaction.member.id})

        const Embed = new EmbedBuilder()
            .setTitle("Blacklist Check")
            .setDescription(`Hey! Your Thunar access is restricted. If you are wondering why, you can come to our Discord server [Thunar Federation](https://discord.gg/JAPEAajAmu) and open a new support ticket and arrange a meeting with the authorities. \n\n ------------------------------------- \n\n **Blacklist Code:** \`${getUser.Code}\` \n (The support team may ask you for the blacklist code. Do not lose)`)
            .setColor("Red")

        interaction.reply({embeds: [Embed], ephemeral: true})
        return;

    }

    //if (await BetaServer.findOne({GuildID: interaction.guildId})) {

    // Slash Commands
    if (interaction.isChatInputCommand()) {
        await commandHandler.handleSlashCommand(interaction);
    }

    // Context Menu
    else if (interaction.isContextMenuCommand()) {
        const context = client.contextMenus.get(interaction.commandName);
        if (context) await contextHandler.handleContext(interaction, context);
        else return interaction.reply({content: "An error has occurred", ephemeral: true}).catch(() => {
        });
    }

    // Buttons
    else if (interaction.isButton()) {
        switch (interaction.customId) {
            case "TICKET_CREATE":
                return ticketHandler.handleTicketOpen(interaction);

            case "TICKET_CLOSE":
                return ticketHandler.handleTicketClose(interaction);

            case "SUGGEST_APPROVE":
                return suggestionHandler.handleApproveBtn(interaction);

            case "SUGGEST_REJECT":
                return suggestionHandler.handleRejectBtn(interaction);

            case "SUGGEST_DELETE":
                return suggestionHandler.handleDeleteBtn(interaction);
        }
    }

    // Modals
    else if (interaction.type === InteractionType.ModalSubmit) {
        switch (interaction.customId) {
            case "SUGGEST_APPROVE_MODAL":
                return suggestionHandler.handleApproveModal(interaction);

            case "SUGGEST_REJECT_MODAL":
                return suggestionHandler.handleRejectModal(interaction);

            case "SUGGEST_DELETE_MODAL":
                return suggestionHandler.handleDeleteModal(interaction);
        }
    }

    const settings = await getSettings(interaction.guild);

    // track stats
    if (settings.stats.enabled) statsHandler.trackInteractionStats(interaction).catch(() => {
    });

};
