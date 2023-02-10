const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const { EMBED_COLORS } = require("@root/config.js");
const LoginRole = require("../../../models/LoginRole")

/**
* @type {import("@structures/Command")}
*/
module.exports = {
    name: "login",
    description: "Register in the guild",
    category: "MODERATION",
    botPermissions: ["BanMembers"],
    command: {
        enabled: true,
        usage: "<ID|@member> [reason]",
        minArgsCount: 1,
    },
    slashCommand: {
        enabled: true,
        options: [
            {
                name: "name",
                description: "state your name",
                type: ApplicationCommandOptionType.String,
                required: true,
            },
            {
                name: "age",
                description: "state your age",
                type: ApplicationCommandOptionType.Integer,
                required: true,
            },
        ],
    },

    async messageRun(message, args) {
        const match = await message.client.resolveUsers(args[0], true);
        const target = match[0];
        if (!target) return message.safeReply(`No user found matching ${args[0]}`);
    },

    async interactionRun(interaction) {
        const name = interaction.options.getString("name")
        const age = interaction.options.getInteger("age")

        if (interaction.member.bannable) {

            /* const lr = await LoginRole.findOne({ GuildID: interaction.guildId }) */

            LoginRole.findOne({ GuildID: interaction.guildId }, async (err, data) => {

                if (!data) return interaction.followUp( "The set login role could not be detected", {ephemeral: true} );
                if (!data.Role) return interaction.followUp({ content: "The set registration role has been deleted. Inform the authorities to readjust the role", ephemeral: true });

                const role = interaction.member.guild.roles.cache.get(data.Role)
                interaction.member.roles.add(role)

                interaction.member.setNickname("⊂ " + name + " ・ " + age + " ⊃")

                const basarili = new EmbedBuilder()
                    .setTitle("Registration Successful 🖋️")
                    .setDescription(`You have registered to the server as **${name}** and **${age}** years old. If you think there is a mistake or you made a mistake while writing, you can try to contact the guild officials.`)
                    .setColor(EMBED_COLORS.BOT_EMBED)
                await interaction.followUp({ embeds: [basarili], ephemeral: true })

            })

        } else {

            const basarili = new EmbedBuilder()
                .setTitle("Registration Failed 🖋️")
                .setDescription(`❌ You could not register due to missing Permissions. Please contact the guild officials and ask for sufficient authorizations for Thunar!`)
                .setColor(EMBED_COLORS.BOT_EMBED)
            await interaction.followUp({ embeds: [basarili], ephemeral: true })
        }
    },
};
