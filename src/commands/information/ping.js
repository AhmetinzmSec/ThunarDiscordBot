/**
 * @type {import("@structures/Command")}
 */
const {EMBED_COLORS} = require("@root/config");
const {EmbedBuilder} = require('discord.js')
const Beta = require("../../../models/BetaTester");
const {betaversion, version} = require("../../../config.json");
const os = require('os')
module.exports = {
    name: "ping",
    description: "shows the current ping from the bot to the discord servers",
    category: "INFORMATION",
    command: {
        enabled: true,
    },
    slashCommand: {
        enabled: true,
        ephemeral: true,
        options: [],
    },

    async messageRun(message, args) {
        await message.safeReply(`🏓 Pong : \`${Math.floor(message.client.ws.ping)}ms\``);
    },

    async interactionRun(interaction, client) {

        if (await Beta.findOne({UserID: interaction.member.id})) {
            interaction.channel
                .send("Measurement in progress...")
                .catch((err) => {
                })
                .then(async (msg) => {
                    const ping = msg.createdTimestamp - interaction.createdTimestamp

                    const Embed = new EmbedBuilder()
                        .setColor(EMBED_COLORS.BOT_EMBED)
                        .setTitle("🏓 Pong!")
                        .setImage(`https://dummyimage.com/2000x500/202225/ffffff&text=${interaction.client.ws.ping}` + "ms")
                        .setDescription(`**Version You Can Access:** \`\`\`${betaversion} \`\`\` **Gateway:** \`\`\`${ping} ms\`\`\` **API Gateway:** \`\`\`${interaction.client.ws.ping} ms\`\`\` **Memory Load:** \`\`\`${(
                            process.memoryUsage().heapUsed /
                            1024 /
                            1024
                        ).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(
                            2
                        )} MB\`\`\` `)

                        .setTimestamp()

                    return await interaction.followUp({
                        embeds: [Embed],
                    })
                        .catch((err) => {
                        })
                        .then(msg.delete().catch((err) => {
                        }))
                })
        } else {

            interaction.channel
                .send("Measurement in progress...")
                .catch((err) => {
                })
                .then(async (msg) => {
                    const ping = msg.createdTimestamp - interaction.createdTimestamp

                    const Embed = new EmbedBuilder()
                        .setColor(EMBED_COLORS.BOT_EMBED)
                        .setTitle("🏓 Pong!")
                        .setImage(`https://dummyimage.com/2000x500/202225/ffffff&text=${interaction.client.ws.ping}` + "ms")
                        .setDescription(`**Version You Can Access:** \`\`\`${version} \`\`\` **Gateway:** \`\`\`${ping} ms\`\`\` **API Gateway:** \`\`\`${interaction.client.ws.ping} ms\`\`\` **Memory Load:** \`\`\`${(
                            process.memoryUsage().heapUsed /
                            1024 /
                            1024
                        ).toFixed(2)} / ${(os.totalmem() / 1024 / 1024).toFixed(
                            2
                        )} MB\`\`\` `)

                        .setTimestamp()

                    return await interaction.followUp({
                        embeds: [Embed],
                    })
                        .catch((err) => {
                        })
                        .then(msg.delete().catch((err) => {
                        }))
                })

        }
    },
};
