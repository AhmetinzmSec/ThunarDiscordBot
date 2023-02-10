const {ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const Account = require("../../../models/Account");
const Beta = require("../../../models/BetaTester");
const {version, betaversion} = require("../../../config.json");
const {EMBED_COLORS} = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "account",
    description: "Manage your Thunar account",
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
                name: "create",
                description: "create account",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "name",
                        description: "Specify your display name",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                    {
                        name: "password",
                        description: "set a password",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                    {
                        name: "recovery",
                        description: "specify your recovery words",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    }
                ],
            },
            {
                name: "delete",
                description: "delete account",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "password",
                        description: "bot to be removed",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                ],
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
        const sub = interaction.options.getSubcommand();

        const dName = interaction.options.getString("name")
        const passWD = interaction.options.getString("password")
        const rec = interaction.options.getString("recovery")

        let DeleteAccoun = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`red`)
                .setLabel("Delete Account")
                .setStyle("Danger")
        )

        let DeleteAccounDeActive = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId(`red`)
                .setDisabled(true)
                .setLabel("Delete Account")
                .setStyle("Danger")
        )

        if (sub === "create") {
            if (await Beta.findOne({UserID: interaction.member.id})) {

                const TAcco = await Account.findOne({UserID: interaction.member.id})

                if (TAcco) {

                    return interaction.followUp({content: `You already have an account named ${TAcco.Name}`})

                } else {

                    await Account.create({

                        UserID: interaction.member.id,
                        Name: dName,
                        Password: passWD,
                        Recovery: rec

                    })

                    const DeletedEmbed = new EmbedBuilder()
                        .setTitle("Thunar Account Deleted")
                        .setColor(EMBED_COLORS.BOT_EMBED)
                        .addFields(
                            {
                                name: "Account Owner",
                                value: `Deleted`,
                                inline: true,
                            },
                            {
                                name: "Account Owner Tag",
                                value: `Deleted`,
                                inline: true,
                            },
                            {
                                name: "Account Owner Full Name",
                                value: `Deleted`,
                                inline: true,
                            },
                            {
                                name: "Account Owner ID",
                                value: `\`\`\`Deleted\`\`\``,
                                inline: false,
                            },
                            {
                                name: "Account Name",
                                value: `\`\`\`Deleted\`\`\``,
                                inline: false,
                            })

                    const NoAc = new EmbedBuilder()
                        .setTitle("Thunar Account Deleted")
                        .setColor(EMBED_COLORS.BOT_EMBED)
                        .addFields(
                            {
                                name: "Account Owner",
                                value: `null`,
                                inline: true,
                            },
                            {
                                name: "Account Owner Tag",
                                value: `null`,
                                inline: true,
                            },
                            {
                                name: "Account Owner Full Name",
                                value: `null`,
                                inline: true,
                            },
                            {
                                name: "Account Owner ID",
                                value: `\`\`\`null\`\`\``,
                                inline: false,
                            },
                            {
                                name: "Account Name",
                                value: `\`\`\`null\`\`\``,
                                inline: false,
                            })

                    const CreatedEmbed = new EmbedBuilder()
                        .setTitle("Thunar Account Created")
                        .setColor(EMBED_COLORS.BOT_EMBED)
                        .addFields(
                            {
                                name: "Account Owner",
                                value: `${interaction.member.user.username}`,
                                inline: true,
                            },
                            {
                                name: "Account Owner Tag",
                                value: `${interaction.member.user.discriminator}`,
                                inline: true,
                            },
                            {
                                name: "Account Owner Full Name",
                                value: `${interaction.member.user.tag}`,
                                inline: true,
                            },
                            {
                                name: "Account Owner ID",
                                value: `\`\`\`${interaction.member.id}\`\`\``,
                                inline: false,
                            },
                            {
                                name: "Account Name",
                                value: `\`\`\`${dName}\`\`\``,
                                inline: false,
                            })
                    const sentMessageTarget = await interaction.followUp({
                        embeds: [CreatedEmbed],
                        components: [DeleteAccoun]
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

                            const TAcco = await Account.findOne({UserID: interaction.member.id})

                            if (TAcco) {

                                await Account.findOneAndDelete({UserID: interaction.member.id})
                                return interaction.editReply({
                                    embeds: [DeletedEmbed],
                                });

                            } else {

                                return interaction.editReply({
                                    embeds: [NoAc],
                                    content: `**‼ No Thunar account found under your name ‼**`,
                                    components: [DeleteAccounDeActive]
                                })

                            }

                        }

                    })

                }

            } else {

                return interaction.followUp(`You must have access to the **${betaversion}** version to use this command. The version you have access to: **${version}**`)

            }
        } else if (sub === "delete") {

            if (await Beta.findOne({UserID: interaction.member.id})) {

                const TAcco = await Account.findOne({UserID: interaction.member.id})

                if (TAcco) {

                    if (TAcco.Password === passWD) {

                        await Account.findOneAndDelete({

                            UserID: interaction.member.id

                        })

                        return interaction.followUp({content: `Account Deleted`})

                    } else {

                        return interaction.followUp({content: `Password entered incorrectly`})

                    }

                } else {

                    return interaction.followUp({content: `No Thunar account found under your name`})

                }

            } else {

                return interaction.followUp(`You must have access to the **${betaversion}** version to use this command. The version you have access to: **${version}**`)

            }

        }
    },
};