const {commandHandler, automodHandler, statsHandler} = require("@src/handlers");
const {PREFIX_COMMANDS, EMBED_COLORS} = require("@root/config");
const {getSettings} = require("@schemas/Guild");
const {EmbedBuilder, ActionRowBuilder, ButtonBuilder} = require("discord.js")
const Beta = require("../../../models/BetaTester")
const {betaversion, version, preversion} = require("../../../config.json")

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').Message} message
 */
module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;
    const settings = await getSettings(message.guild);

    // command handler
    let isCommand = false;
    if (PREFIX_COMMANDS.ENABLED) {
        // check for bot mentions
        if (message.content.includes(`${client.user.id}`)) {

            let rowTarget = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setLabel("WEB Site")
                    .setStyle("Link")
                    .setURL("https://thunar.vercel.app/"),
                new ButtonBuilder()
                    .setLabel("Wiki Site")
                    .setStyle("Link")
                    .setURL("https://wiki-thunar.vercel.app/"),
                new ButtonBuilder()
                    .setLabel("Invite Link")
                    .setStyle("Link")
                    .setURL(`https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&guild_id=${message.guildId}&permissions=8&scope=bot%20applications.commands`),
            )

            if (message.author.id === "801006452416184330") {

                const embed = new EmbedBuilder()
                    .setTitle("Developer Call...")
                    .setDescription(`
                        **• Version Info**
                        <:list1:1060976567758630922>**Developer Accessible Version:** \`${preversion}\`
                        <:list1:1060976567758630922>**Beta Version:** \`${betaversion}\`
                        <:listend:1060976814622785607>**Alpha Version:** \`${version}\`

                        **• Release Channels**
                        <:list1:1060976567758630922>**${preversion}:** \`Preview Release Channel\`
                        <:list1:1060976567758630922>**${betaversion}:** \`Beta Release Channel\`
                        <:listend:1060976814622785607>**${version}:** \`Alpha Release Channel\`

                        **• BackEnd Info**
                        <:list1:1060976567758630922>**Default Prefix:** { \`${settings.prefix}\` }
                        <:list1:1060976567758630922>**Slash Commands:** \`Active\`
                        <:listend:1060976814622785607>**Database Status:** \`Connection Healthy\``)
                    .setColor(EMBED_COLORS.BOT_EMBED)
                message.channel.safeSend({embeds: [embed], components: [rowTarget]});

            } else if (await Beta.findOne({UserID: message.author.id})) {

                const embed = new EmbedBuilder()
                    .setTitle("Thunar Continues to Serve...")
                    .setDescription(`
                        • **Version You Have Access:** \`${betaversion}\`
                        • **Your Access Channel:** \`Beta Releases\`
                        • **My prefix is:** { \`${settings.prefix}\` } (Message Prefix)
                        • **My prefix is:** { \`/\` } (Slash Command Prefix)
                        • **Prefix customization:** { \`/setprefix\` } (Only Message Prefix)
                        • **Thunar help table:** \`/help\``)
                    .setColor(EMBED_COLORS.BOT_EMBED)
                message.channel.safeSend({embeds: [embed], components: [rowTarget]});

            } else {

                const embed = new EmbedBuilder()
                    .setTitle("Thunar Continues to Serve...")
                    .setDescription(`
                        • **Version You Have Access:** \`${version}\`
                        • **Your Access Channel:** \`Alpha Releases\`
                        • **My prefix is:** { \`${settings.prefix}\` } (Message Prefix)
                        • **My prefix is:** { \`/\` } (Slash Command Prefix)
                        • **Prefix customization:** { \`/setprefix\` } (Only Message Prefix)
                        • **Thunar help table:** \`/help\``)
                    .setColor(EMBED_COLORS.BOT_EMBED)
                message.channel.safeSend({embeds: [embed], components: [rowTarget]});

            }
        }

        if (message.content && message.content.startsWith(settings.prefix)) {
            const invoke = message.content.replace(`${settings.prefix}`, "").split(/\s+/)[0];
            const cmd = client.getCommand(invoke);
            if (cmd) {
                isCommand = true;
                commandHandler.handlePrefixCommand(message, cmd, settings);
            }
        }
    }

    // stats handler
    if (settings.stats.enabled) await statsHandler.trackMessageStats(message, isCommand, settings);

    // if not a command
    if (!isCommand) await automodHandler.performAutomod(message, settings);
};
