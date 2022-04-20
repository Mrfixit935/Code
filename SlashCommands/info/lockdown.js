const { CommandInteraction, MessageEmbed } = require("discord.js");
const DB = require("../../Schemas/Lockdown");
const ms = require("ms");

module.exports = {
  name: "lock",
  description: "Lockdown this channel",
  options: [
    {
      name: "time",
      description: "Expire date for this lockdown (1m, 1h, 1d)",
      type: "STRING",
    },
    {
      name: "reason",
      description: "Provide a reason for this lockdown.",
      type: "STRING",
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   */
  async run(client, interaction) {
    const { guild, channel, options } = interaction;

    const Reason = options.getString("reason") || "no specified reason";

    const Embed = new MessageEmbed();

    if (!channel.permissionsFor(guild.id).has("SEND_MESSAGES"))
      return interaction.followUp({
        embeds: [
          Embed.setColor("RED").setDescription(
            "⛔ | This channel is already locked."
          ),
        ],
        ephemeral: true,
      });

    channel.permissionOverwrites.edit(guild.id, {
      SEND_MESSAGES: false,
    });

    interaction.followUp({
      embeds: [
        Embed.setColor("RED").setDescription(
          `🔒 | This channel is now under lockdown for: ${Reason}`
        ),
      ],
    });
    const Time = options.getString("time");
    if (Time) {
      const ExpireDate = Date.now() + ms(Time);
      DB.create({ GuildID: guild.id, ChannelID: channel.id, Time: ExpireDate });

      setTimeout(async () => {
        channel.permissionOverwrites.edit(guild.id, {
          SEND_MESSAGES: null,
        });
        interaction
          .editReply({
            embeds: [
              Embed.setDescription(
                "🔓 | The lockdown has been lifted"
              ).setColor("GREEN"),
            ],
          })
          .catch(() => {});
        await DB.deleteOne({ ChannelID: channel.id });
      }, ms(Time));
    }
  },
};