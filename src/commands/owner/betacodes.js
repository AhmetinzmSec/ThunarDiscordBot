const {EMBED_COLORS} = require("@root/config");
const {ApplicationCommandOptionType, EmbedBuilder} = require("discord.js");
const BetaCode = require("../../../models/BetaCodeS")

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "betacodes",
    description: "generate new code",
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
                name: "serverid",
                required: true,
                description: "add the user to the blacklist",
                type: ApplicationCommandOptionType.String,
            },
            ],
    },

    async messageRun(message, args, data) {
        const newPrefix = args[0];
        const response = await (newPrefix, data.settings);
        await message.safeReply(response);
        },

    async interactionRun(interaction, data, client) {

        const target = interaction.options.getString("serverid");

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

        const hersey = random(false, 32) //burayı değiştirebilirsin

        const codke = hersey;
        // Embed'lar ayarlandı
        const captcha_embed = new EmbedBuilder()
            .setColor(EMBED_COLORS.BOT_EMBED)
            .setTitle("📜 Successful")
            .setDescription(`New code generated: ${codke}`)

        const beta = await BetaCode.findOne({ServerID: target})

        if (await BetaCode.findOne({UserID: target})) {

            return interaction.followUp({
                content: `A code has already been created for the member: **${beta.Code}**`,
                ephemeral: true
            })

        } else {

            await BetaCode.create(
                    {
                        ServerID: target,
                        Code: codke,
                    })

            interaction.followUp({embeds: [captcha_embed], ephemeral: true})

        }

    },
};