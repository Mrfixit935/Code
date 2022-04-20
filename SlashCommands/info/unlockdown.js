const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Schemas/Lockdown");


module.exports = {
  name: "unlock",
  description: "Lift a lockdown from a channel",
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async run(client, interaction) {
    const { guild, channel } = interaction;

    const Embed = new MessageEmbed();

    if (channel.permissionsFor(guild.id).has("SEND_MESSAGES"))
      return interaction.followUp({
        embeds: [
          Embed.setColor("RED").setDescription(
            "⛔ | This channel is not locked"
          ),
        ],
        ephemeral: true,
      });

    channel.permissionOverwrites.edit(guild.id, {
      SEND_MESSAGES: null,
    });

    await DB.deleteOne({ ChannelID: channel.id });

    interaction.followUp({
      embeds: [
        Embed.setColor("GREEN").setDescription(
          "🔓 | Lockdown has been lifted."
        ),
      ],
    });
  },
};

// SYSTEM //
