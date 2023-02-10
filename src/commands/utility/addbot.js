const {ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js");
const AddBot = require("../../../models/AddBot");
const VerifyBot = require("../../../models/VerifyBot");
const BotLog = require("../../../models/BotLog");
const Beta = require("../../../models/BetaTester");
const Owner = require("../../../models/BotOwner");
const BL = require("../../../models/BotBlackList");
const {version, betaversion} = require("../../../config.json");
const {EMBED_COLORS} = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "addbot",
    description: "add bot server",
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
                name: "botid",
                description: "your bot id",
                required: true,
                type: ApplicationCommandOptionType.String,
            },
            {
                name: "botprefix",
                description: "your bot prefix",
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
        const id = interaction.options.getString("botid")
        const pref = interaction.options.getString("botprefix")

        if (await Beta.findOne({UserID: interaction.member.id})) {

            const AddCH = await AddBot.findOne({GuildID: interaction.guildId})
            const adchannel = interaction.guild.channels.cache.get(AddCH.ChannelID);
            if (await AddBot.findOne({GuildID: interaction.guildId})) {

                if (interaction.channel.id !== AddCH.ChannelID) {
                    return interaction.followUp(`This is not the bot add channel... Adding is allowed on the ${adchannel} channel.`)
                }

            }

            const ownerId = await Owner.findOne({
                GuildID: interaction.guildId,
                OwnerID: interaction.member.id,
                BotID: id
            })

            const blackList = await BL.findOne({
                GuildID: interaction.guildId,
                BotID: id
            })

            if (blackList) {

                return interaction.followUp({
                    content: 'Hey! Your bot appears to be blacklisted...',
                    ephemeral: true
                })

            }

            if (ownerId) {

                return interaction.followUp({
                    content: 'Your bot is already queued or already on the server!',
                    ephemeral: true
                })

            } else {

                await Owner.create({
                    GuildID: interaction.guildId,
                    OwnerID: interaction.member.id,
                    Prefix: pref,
                    BotID: id
                })

            }


            const verifych = await VerifyBot.findOne({GuildID: interaction.guildId})
            const lych = await BotLog.findOne({GuildID: interaction.guildId})

            const ch = interaction.guild.channels.cache.get(verifych.ChannelID)
            const logch = interaction.guild.channels.cache.get(lych.ChannelID)

            const User = interaction.client.users.cache.get(id);

            let rowTarget = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("Add Bot")
                    .setStyle("Link")
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${id}&guild_id=${interaction.guildId}&scope=bot&permissions=0`),
                new ButtonBuilder()
                    .setCustomId(`success`)
                    .setLabel("Confirm Bot")
                    .setStyle("Primary"),
                new ButtonBuilder()
                    .setCustomId(`red`)
                    .setLabel("Reject Bot")
                    .setStyle("Danger")
            )

            if (await VerifyBot.findOne({GuildID: interaction.guildId})) {

                if (verifych.ChannelID) {

                    const embed = new EmbedBuilder()
                        .setTitle(`${User.username} - Application`)
                        .addFields(
                            {
                                name: `・ Bot Name`,
                                value: `${User.username}`,
                                inline: true
                            },
                            {
                                name: `・ Bot Full Name`,
                                value: `${User.tag}`,
                                inline: true
                            },
                            {
                                name: `・ Bot ID`,
                                value: `${id}`,
                                inline: true
                            },
                            {
                                name: `・ Bot Profile`,
                                value: `[Link](https://discord.com/users/${id})`,
                                inline: true
                            },
                            {
                                name: `・ Name on Server`,
                                value: `⊂ ${pref} ⊃ ・ ${User.username}`,
                                inline: true
                            },
                            {
                                name: `・ 8 Perm`,
                                value: `[Full Perm](https://discord.com/api/oauth2/authorize?client_id=${id}&guild_id=${interaction.guildId}&scope=bot&permissions=8)`,
                                inline: true
                            },
                            {
                                name: `Bot Prefix`,
                                value: `\`\`\`${pref}\`\`\``,
                                inline: false
                            },
                            {
                                name: `Applicant`,
                                value: `\`\`\`${interaction.member.user.username}#${interaction.member.user.discriminator}\`\`\``,
                                inline: false
                            },
                            {
                                name: `Applicant ID`,
                                value: `\`\`\`${interaction.member.user.id}\`\`\``,
                                inline: false
                            })
                        .setDescription(`**Tip:** You can perform actions by clicking the buttons.`)
                        .setColor(EMBED_COLORS.BOT_EMBED)

                    const sucembed = new EmbedBuilder()
                        .setTitle("Bot Approved 🤖")
                        .setDescription(`\`${interaction.member.user.username}#${interaction.member.user.discriminator}\` member's <@${id}> bot confirmed 🥳`)
                        .setColor(EMBED_COLORS.BOT_EMBED)

                    const rejtembed = new EmbedBuilder()
                        .setTitle("Bot Rejected 🤖")
                        .setDescription(`\`${interaction.member.user.username}#${interaction.member.user.discriminator}\` member's <@${id}> bot rejected ❌`)
                        .setColor(EMBED_COLORS.BOT_EMBED)

                    const sentMessageTarget = await ch.send({
                        embeds: [embed], components: [rowTarget]
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

                        if (buttonId === "success") {

                            await Owner.findOneAndDelete({GuildID: interaction.guildId})
                            return logch.send({embeds: [sucembed]});

                        } else if (buttonId === "red") {

                            await Owner.findOneAndDelete({GuildID: interaction.guildId})
                            return logch.send({embeds: [rejtembed]});

                        }

                    })

                }

            }

            return interaction.followUp({content: "Your bot has been placed in the waiting queue. This will change the approval process according to the speed of the authorities. Please be patient...."});
        } else {

            return interaction.followUp(`You must have access to the **${betaversion}** version to use this command. The version you have access to: **${version}**`)

        }
    },
};