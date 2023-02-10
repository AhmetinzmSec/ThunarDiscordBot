const {EmbedBuilder} = require("discord.js");
const {inviteHandler, greetingHandler} = require("@src/handlers");
const {EMBED_COLORS} = require("@root/config");
const {getSettings} = require("@schemas/Guild");
const BotLog = require("../../../models/BotLog");
const Bot = require("../../../models/BotOwner")

/**
 * @param {import('@src/structures').BotClient} client
 * @param {import('discord.js').GuildMember} member
 */
module.exports = async (client, member) => {
    if (!member || !member.guild) return;

    const {guild} = member;
    const settings = await getSettings(guild);

    const lych = await BotLog.findOne({GuildID: member.guild.id})
    const logch = member.guild.channels.cache.get(lych.ChannelID)

    const Owner = await Bot.findOne({GuildID: member.guild.id})

    const User = member.client.users.cache.get(Owner.OwnerID);
    const BotName = member.client.users.cache.get(Owner.BotID);

    if (Bot.findOne({BotID: member.user.id})) {

        member.setNickname(`⊂ ${Owner.Prefix} ⊃ ・ ${BotName.username}`)

        await Bot.findOneAndDelete({GuildID: member.guild.id})

        const sucembed = new EmbedBuilder()
            .setTitle("Bot Approved 🤖")
            .setColor(EMBED_COLORS.BOT_EMBED)
            .setDescription(`\`${User.username}\` member's bot approved 🥳`)
        return logch.send({embeds: [sucembed]});

    }
    // Autorole
    if (settings.autorole) {
        const role = guild.roles.cache.get(settings.autorole);
        if (role) member.roles.add(role).catch((err) => {
        });
    }

    // Check for counter channel
    if (settings.counters.find((doc) => ["MEMBERS", "BOTS", "USERS"].includes(doc.counter_type.toUpperCase()))) {
        if (member.user.bot) {
            settings.data.bots += 1;
            await settings.save();
        }
        if (!client.counterUpdateQueue.includes(guild.id)) client.counterUpdateQueue.push(guild.id);
    }

    // Check if invite tracking is enabled
    const inviterData = settings.invite.tracking ? await inviteHandler.trackJoinedMember(member) : {};

    // Send welcome message
    greetingHandler.sendWelcome(member, inviterData);
};
