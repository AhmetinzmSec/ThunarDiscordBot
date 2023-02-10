const {ApplicationCommandOptionType, EmbedBuilder} = require("discord.js");
const Beta = require("../../../models/BetaTester");
const Token = require("../../../models/BetaCode");
const {EMBED_COLORS} = require("@root/config");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "beta",
    description: "become a beta user",
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
                description: "specify the beta access token issued to you",
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
            .setDescription(`Now you can use Thunar's new incoming features before anyone else`)
            .setThumbnail(interaction.member.displayAvatarURL())
            .setColor(EMBED_COLORS.BOT_EMBED)

        const noid = new EmbedBuilder()
            .setTitle("Code Invalid ❌")
            .setDescription(`You entered the access token given to you incorrectly.`)
            .setThumbnail(interaction.member.displayAvatarURL())
            .setColor(EMBED_COLORS.BOT_EMBED)

        const nocode = new EmbedBuilder()
            .setTitle("Access Token Not Found 🔎")
            .setDescription(`There are no Beta Access Tokens assigned to your name`)
            .setThumbnail(interaction.member.displayAvatarURL())
            .setColor(EMBED_COLORS.BOT_EMBED)

        const avtivepre = new EmbedBuilder()
            .setTitle("Active Membership 🧗")
            .setDescription(`You have an ongoing Beta membership in your name. You cannot use tokens`)
            .setThumbnail(interaction.member.displayAvatarURL())
            .setColor(EMBED_COLORS.BOT_EMBED)

        if (await Token.findOne({UserID: interaction.member.id})){
            if (token == await tokenke.Code) {

                if (await Beta.findOne({

                    UserID: interaction.member.id,

                })) {

                    interaction.followUp({embeds: [avtivepre], ephemeral: true})

                } else {
                    await Beta.create({

                        UserID: interaction.member.id,
                        GuildID: interaction.guildId

                    })

                    await Token.findOneAndDelete({

                        UserID: interaction.member.id

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