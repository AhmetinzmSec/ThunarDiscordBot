const { ApplicationCommandOptionType } = require("discord.js");
const LoginRole = require("../../../models/LoginRole")

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
    name: "loginrole",
    description: "setup role to be login role",
    category: "ADMIN",
    userPermissions: ["ManageGuild"],
    command: {
        enabled: true,
        usage: "<role|off>",
        minArgsCount: 1,
    },
    slashCommand: {
        enabled: true,
        ephemeral: true,
        options: [
            {
                name: "add",
                description: "setup the loginrole",
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: "role",
                        description: "the role to be given",
                        type: ApplicationCommandOptionType.Role,
                        required: false,
                    },
                    {
                        name: "role_id",
                        description: "the role id to be given",
                        type: ApplicationCommandOptionType.String,
                        required: false,
                    },
                ],
            },
            {
                name: "remove",
                description: "disable the loginrole",
                type: ApplicationCommandOptionType.Subcommand,
            },
        ],
    },

    async messageRun(message, args, data) {
        const input = args.join(" ");
        let response;

        if (input.toLowerCase() === "off") {
            response = await (message, null, data.settings);
        } else {
            const roles = message.guild.findMatchingRoles(input);
            if (roles.length === 0) response = "No matching roles found matching your query";
            else response = await (message, roles[0], data.settings);
        }

        await message.safeReply(response);
    },

    async interactionRun(interaction, data) {
        const sub = interaction.options.getSubcommand();
        let response;

        // add
        if (sub === "add") {
            let role = interaction.options.getRole("role");
            if (!role) {
                const role_id = interaction.options.getString("role_id");
                if (!role_id) return interaction.followUp("Please provide a role or role id");
                const roles = interaction.guild.findMatchingRoles(role_id);
                if (roles.length === 0) return interaction.followUp("No matching roles found matching your query");
                role = roles[0];
            }

            const lr = await LoginRole.findOne({ GuildID: interaction.guildId });

            if (await LoginRole.findOne({ GuildID: interaction.guildId })) {

                await LoginRole.findOneAndUpdate({

                    GuildID: interaction.guildId,
                    Role: role.id

                })

                interaction.followUp("Rol updated")

            } else {

                await LoginRole.create({

                    GuildID: interaction.guildId,
                    Role: role.id

                })

                await LoginRole.update({

                    Role: role.id

                })

                interaction.followUp("Role setted")

            }

        }

        // remove
        else if (sub === "remove") {

            if (await LoginRole.findOne({ GuildID: interaction.guildId })) {

                await LoginRole.findOneAndDelete({

                    GuildID: interaction.guildId

                })

                interaction.followUp("Rol deleted")

            } else {

                interaction.followUp("Role already deleted")

            }
            response = await setAutoRole(interaction, null, data.settings);
        }

        // default
        else response = "Invalid subcommand";

        await interaction.followUp(response);
    },
};