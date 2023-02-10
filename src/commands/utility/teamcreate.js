const {ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const Team = require("../../../models/Team");
const Beta = require("../../../models/BetaTester");
const {version, betaversion} = require("../../../config.json");
const {EMBED_COLORS} = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "teamcreate",
    description: "create a new team",
    category: "UTILITY",
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
                name: "name",
                description: "set team name",
                required: true,
                type: ApplicationCommandOptionType.String,
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

        const name = interaction.options.getString("name")

        if (await Beta.findOne({UserID: interaction.member.id})) {

            const ownerId = await Team.findOne({TeamCreator: interaction.member.id})

            let rowTarget = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`red`)
                    .setLabel("Delete Team")
                    .setStyle("Danger")
            )

            let note = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId(`red`)
                    .setDisabled(true)
                    .setLabel("Delete Team")
                    .setStyle("Danger")
            )

            if (ownerId) {

                const sentMessageTarget = await interaction.followUp({
                    content: `You already have a created team: **${ownerId.TeamName}**`,
                    ephemeral: true,
                    components: [rowTarget]
                })

                const filterTarget = (i) => {
                }

                const collectorTarget =
                    await sentMessageTarget.createMessageComponentCollector({
                        filterTarget,
                    })

                collectorTarget.on("collect", async (i) => {
                    await i.deferUpdate().catch((err) => {
                    })

                    const buttonId = i.customId

                    if (buttonId === "red") {

                        await Team.findOneAndDelete({TeamCreator: interaction.member.id})
                        return interaction.followUp({content: "‼️ **Team Deleted...**", ephemeral: true, components: [note]});

                    }
                })

            } else {

                await Team.create({
                    TeamCreator: interaction.member.id,
                    TeamName: name
                })

                const embed = new EmbedBuilder()
                    .setTitle("Team Created")
                    .setDescription(`You have created a new team named **${name}**`)
                    .setColor(EMBED_COLORS.BOT_EMBED)
                const sentMessageTarget = await interaction.followUp({embeds: [embed], components: [rowTarget]})

                const filterTarget = (i) => {
                }

                const collectorTarget =
                    await sentMessageTarget.createMessageComponentCollector({
                        filterTarget,
                    })

                collectorTarget.on("collect", async (i) => {
                    await i.deferUpdate().catch((err) => {
                    })

                    const buttonId = i.customId

                    if (buttonId === "red") {

                        await Team.findOneAndDelete({TeamCreator: interaction.member.id})
                        return interaction.editReply({content: "‼️ **Team Deleted...**", ephemeral: true, components: [note]});

                    }
                })

            }
        } else {

            return interaction.followUp(`You must have access to the **${betaversion}** version to use this command. The version you have access to: **${version}**`)

        }
    },
};