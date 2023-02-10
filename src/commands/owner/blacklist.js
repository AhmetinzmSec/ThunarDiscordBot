const { EMBED_COLORS } = require("@root/config");
const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");
const Press = require("../../../models/Supress")

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "blacklist",
  description: "block members against using Thunar",
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
          description: "add the user to the blacklist",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "member to apply",
              type: ApplicationCommandOptionType.User,
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
          description: "remove user from blacklist",
          type: ApplicationCommandOptionType.Subcommand,
          options: [
            {
              name: "user",
              description: "member to be removed",
              type: ApplicationCommandOptionType.User,
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

    const target = interaction.options.getUser("user");
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

    // Embed'lar ayarlandı
    const captcha_embed = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setTitle("📜 User Blacklisted")
        .setDescription("User will no longer be able to use Thunar commands ❌!")
    const captcha_embed2 = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setTitle("📜 User Blacklisted")
        .setDescription("User will be able to continue using Thunar commands ✅!")
    const developersend = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(target.displayAvatarURL())
        .setTitle("📜 Blacklist Updated")
        .setDescription(`• **Added Member:** \`${target}\` \n\n • **Added Reason:** \`${sbep || "Reason Not Specified"}\` \n\n • **Added by:** \`${interaction.member.user.username}#${interaction.member.user.discriminator}\` \n\n • **Blacklist Code:** \`${codke}\``)
    const developersend2 = new EmbedBuilder()
        .setColor(EMBED_COLORS.BOT_EMBED)
        .setThumbnail(target.displayAvatarURL())
        .setTitle("📜 Blacklist Updated")
        .setDescription(`• **Removed Member:** \`${target}\``)

    const recomchn = interaction.client.channels.cache.get("1041640612098748466");
    if (!recomchn) return;

    if (sub === "apply") {

       if (await Press.findOne({UserID: target.id})){

            return interaction.followUp({content: "Member already blacklisted", ephemeral: true})

       } else {

        await Press.create(
            {
                Sebep: sbep,
                Code: codke,
                Ekleyen: interaction.member.id,
                UserID: target.id
            })

        recomchn.send(`**${hersey}** code member`)
        recomchn.send({ embeds: [developersend] })
        interaction.followUp({ embeds: [captcha_embed], ephemeral: true })

       }

      }

      if (sub === "remove"){

        if (await Press.findOne({UserID: target.id})){

            await Press.deleteOne(
                {
                    UserID: target.id
                })
            recomchn.send({ embeds: [developersend2] })
            interaction.followUp({ embeds: [captcha_embed2], ephemeral: true })

       } else {

        return interaction.followUp({content: "The member has already been blacklist", ephemeral: true})

       }

      }

  },
};