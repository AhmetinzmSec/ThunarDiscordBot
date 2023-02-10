const {EMBED_COLORS} = require("@root/config");
const {ApplicationCommandOptionType, EmbedBuilder} = require("discord.js");
const {preversion, version, betaversion} = require("../../../config.json");
const Beta = require("../../../models/BetaTester");
const Press = require("../../../models/BotBlackList")

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "botblacklist",
    description: "blacklist bots on your botlist server",
    category: "OWNER",
    command: {
        enabled: true,
        usage: "<new-prefix>",
        minArgsCount: 1,
    },
    slashCommand: {
        enabled: true,
        ephemeral: true,
        options: [
            {
                name: "apply",
                description: "add the bot to the blacklist",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "user",
                        description: "bot to apply",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                    {
                        name: "reason",
                        description: "why is it blacklisted?",
                        type: ApplicationCommandOptionType.String,
                        required: false,
                    }
                ],
            },
            {
                name: "remove",
                description: "remove bot from blacklist",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "user",
                        description: "bot to be removed",
                        type: ApplicationCommandOptionType.String,
                        required: true,
                    },
                ],
            },
        ],
    },

    async messageRun(message, args, data) {
        const newPrefix = args[0];
        const response = await (newPrefix, data.settings);
        await message.safeReply(response);
    },

    async interactionRun(interaction, data, client) {

        const sub = interaction.options.getSubcommand();

        const target = interaction.options.getString("user");
        const sbep = interaction.options.getString("reason");

        function random(randomFlag, min, max) {
            let birharf = "",
                range = min,
                harfler = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
                    'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
                    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l',
                    'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
                    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

            if (randomFlag) {
                range = Math.round(Math.random() * (max - min)) + min; // Any length
            }
            for (let i = 0; i < range; i++) {
                pos = Math.round(Math.random() * (harfler.length - 1));
                birharf += harfler[pos];
            }
            return birharf;
        }

        const hersey = random(false, 6) //burayı değiştirebilirsin

        const codke = hersey;

        if (await Beta.findOne({UserID: interaction.member.id})) {
            if (interaction.member.id !== "801006452416184330") {

                return interaction.followUp(`You must have access to the **${preversion}** version to use this command. The version you have access to: **${betaversion}**`)

            }
        } else {

            return interaction.followUp(`You must have access to the **${preversion}** version to use this command. The version you have access to: **${version}**`)

        }

        // Embed'lar ayarlandı
        const captcha_embed = new EmbedBuilder()
            .setColor(EMBED_COLORS.BOT_EMBED)
            .setTitle("📜 Bot Blacklisted")
            .setDescription("This bot will no longer be able to be added to the server... ❌!")
        const captcha_embed2 = new EmbedBuilder()
            .setColor(EMBED_COLORS.BOT_EMBED)
            .setTitle("📜 Bot Blacklisted")
            .setDescription("Bot has been blacklisted and restrictions removed ✅!")

        const recomchn = interaction.client.channels.cache.get("1041640612098748466");
        if (!recomchn) return;

        if (sub === "apply") {

            if (await Press.findOne({BotID: target})) {

                return interaction.followUp({content: "Bot already blacklisted", ephemeral: true})

            } else {

                await Press.create(
                    {
                        GuildID: interaction.guildId,
                        BotID: target,
                        Sebep: sbep,
                        Code: codke,
                        Ekleyen: interaction.member.id,
                    })
                interaction.followUp({embeds: [captcha_embed], ephemeral: true})

            }

        }

        if (sub === "remove") {

            if (await Press.findOne({UserID: target})) {

                await Press.deleteOne(
                    {
                        UserID: target
                    })
                interaction.followUp({embeds: [captcha_embed2], ephemeral: true})

            } else {

                return interaction.followUp({content: "The member has already been blacklist", ephemeral: true})

            }

        }

    },
};