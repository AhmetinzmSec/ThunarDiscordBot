const {ApplicationCommandOptionType, EmbedBuilder} = require("discord.js");
const Beta = require("../../../models/BetaServer");
const Token = require("../../../models/BetaCodeS");
const {EMBED_COLORS} = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "betaserver",
    description: "unlock Thunar Beta on your server",
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
                name: "token",
                description: "specify the access token specific to your server",
                required: false,
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

        const token = interaction.options.getString("token")
        const tokenke = await Token.findOne({UserID: interaction.member.id})

        const id = new EmbedBuilder()
            .setTitle("Beta Version Accessed ✅")
            .setDescription(`Thunar Beta is now available on your server`)
            .setThumbnail(interaction.member.displayAvatarURL())
            .setColor(EMBED_COLORS.BOT_EMBED)

        const noid = new EmbedBuilder()
            .setTitle("Code Invalid ❌")
            .setDescription(`Error detected in access token. Thunar is case sensitive`)
            .setThumbnail(interaction.member.displayAvatarURL())
            .setColor(EMBED_COLORS.BOT_EMBED)

        const nocode = new EmbedBuilder()
            .setTitle("Access Token Not Found 🔎")
            .setDescription(`There are no Beta Access Tokens assigned to your server`)
            .setThumbnail(interaction.member.displayAvatarURL())
            .setColor(EMBED_COLORS.BOT_EMBED)

        const avtivepre = new EmbedBuilder()
            .setTitle("Active Beta Server 🧗")
            .setDescription(`Your server is already open to beta features. If you have been given a new code, you cannot use it`)
            .setThumbnail(interaction.member.displayAvatarURL())
            .setColor(EMBED_COLORS.BOT_EMBED)

        if (await Token.findOne({UserID: interaction.member.id})){
            if (token == await tokenke.Code) {

                if (await Beta.findOne({

                    GuildID: interaction.guildId

                })) {

                    interaction.followUp({embeds: [avtivepre], ephemeral: true})

                } else {
                    await Beta.create({

                        GuildID: interaction.guildId

                    })

                    await Token.findOneAndDelete({

                        GuildID: interaction.guildId

                    })

                    interaction.followUp({embeds: [id], ephemeral: true})
                }

            } else {

                interaction.followUp({embeds: [noid], ephemeral: true})

            }
        } else {

            interaction.followUp({embeds: [nocode], ephemeral: true})

        }

    },
}
;