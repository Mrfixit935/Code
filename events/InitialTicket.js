const {
  ButtonInteraction,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const client = require("../index");

const DB = require("../Schemas/Ticket");
const TicketSetupData = require("../Schemas/TicketSetup");
module.exports = {
  name: "interactionCreate",
  /**
   *
   * @param {ButtonInteraction} interaction
   */
  async run(interaction) {
    if (!interaction.isButton()) return;
    const { guild, member, customId } = interaction;

    const Data = await TicketSetupData.findOne({ GuildID: guild.id });
    if (!Data) return;

    if (!Data.Buttons.includes(customId)) return;

    const ID = Math.floor(Math.random() * 90000) + 10000;

    await guild.channels
      .create(`${customId + "-" + ID}`, {
        type: "GUILD_TEXT",
        parent: Data.Category,
        permissionOverwrites: [
          {
            id: member.id,
            allow: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
          },
          {
            id: Data.Everyone,
            deny: ["SEND_MESSAGES", "VIEW_CHANNEL", "READ_MESSAGE_HISTORY"],
          },
        ],
      })
      .then(async (channel) => {
        await DB.create({
          GuildID: guild.id,
          MembersID: member.id,
          TicketID: ID,
          ChannelID: channel.id,
          Closed: false,
          Locked: false,
          Type: customId,
          Claimed: false,
        });

        const Embed = new MessageEmbed()
          .setAuthor({
            name: `${guild.name} | Ticket: ${ID}`,
            iconURL: guild.iconURL({ dynamic: true }),
          })
          .setDescription(
            `Ticket Opened By: ${member}
            Please wait patiently for a response from the Staff team, describe your issue or what you want in as much detail as possible.`
          )
          .setFooter({ text: "Please Do not ping the Staff Team." });

        const Buttons = new MessageActionRow();
        Buttons.addComponents(
          new MessageButton()
            .setCustomId("close")
            .setLabel("Save & Close Ticket")
            .setStyle("PRIMARY")
            .setEmoji("💾"),
          new MessageButton()
            .setCustomId("lock")
            .setLabel("Lock")
            .setStyle("SECONDARY")
            .setEmoji("🔒"),
          new MessageButton()
            .setCustomId("unlock")
            .setLabel("Unlock")
            .setStyle("SUCCESS")
            .setEmoji("🔓"),
          new MessageButton()
            .setCustomId("claim")
            .setLabel("Claim")
            .setStyle("PRIMARY")
            .setEmoji("🛄")
        );

        channel.send({
          embeds: [Embed],
          components: [Buttons],
        });
        await channel
          .send({ content: `${member} here is your ticket` })
          .then((m) => {
            setTimeout(() => {
              m.delete().catch(() => {});
            }, 1 * 5000);
          });

        interaction.followUp({
          content: `${member} your ticket has been created: ${channel}`,
          ephemeral: true,
        });
      });
  },
};