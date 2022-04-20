/// Ticket Setup Command ///
const {
  MessageEmbed,
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const DB = require("../../Schemas/TicketSetup");

module.exports = {
  name: "ticketsetup",
  description: "Setup your ticketing message.",
  options: [
    {
      name: "channel",
      description: "Select the ticket creation channel",
      required: true,
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
    },
    {
      name: "category",
      description: "Select the ticket channels's creation category.",
      required: true,
      type: "CHANNEL",
      channelTypes: ["GUILD_CATEGORY"],
    },
    {
      name: "transcripts",
      description: "Select the transcripts channel.",
      required: true,
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
    },
    {
      name: "handlers",
      description: "Select the ticket handler's role.",
      required: true,
      type: "ROLE",
    },
    {
      name: "everyone",
      description: "Provide the @everyone role. ITS IMPORTANT!",
      required: true,
      type: "ROLE",
    },
    {
      name: "description",
      description: "Set the description of the ticket creation channel.",
      required: true,
      type: "STRING",
    },
    {
      name: "firstbutton",
      description:
        " website.",
      required: true,
      type: "STRING",
    },
    {
      name: "secondbutton",
      description:
        "Livery",
      required: true,
      type: "STRING",
    },
      {
      name: "thirdbutton",
      description:
        "Clothing ",
      required: true,
      type: "STRING",
    },
      {
      name: "forthbutton",
      description:
        "Discord Server ",
      required: true,
      type: "STRING",
    },
     {
      name: "fithbutton",
      description:
        "Customer Service .",
      required: true,
      type: "STRING",
    },
      {
      name: "sixthbutton",
      description:
        " Logo",
      required: true,
      type: "STRING",
    },
      {
      name: "seventhbutton",
      description:
        "License ",
      required: true,
      type: "STRING",
    },
      {
      name: "eighthbutton",
      description:
        "Discord bot ",
      required: true,
      type: "STRING",
    },

     
  ],

  /**
   *
   * @param {CommandInteraction} interaction
   */
  async run(client, interaction) {
    const { guild, options } = interaction;

    try {
      const Channel = options.getChannel("channel");
      const Category = options.getChannel("category");
      const Transcripts = options.getChannel("transcripts");
      const Handlers = options.getRole("handlers");
      const Everyone = options.getRole("everyone");

      const Description = options.getString("description");

      const Button1 = options.getString("firstbutton").split(",");
      const Button2 = options.getString("secondbutton").split(",");
      const Button3 = options.getString("thirdbutton").split(",");
      const Button4 = options.getString("forthbutton").split(",");
      const Button5 = options.getString("fithbutton").split(",");
      const Button6 = options.getString("sixthbutton").split(",");
      const Button7 = options.getString("seventhbutton").split(",");
      const Button8 = options.getString("eighthbutton").split(",");
      

      const Emoji1 = Button1[1];
      const Emoji2 = Button2[1];
      const Emoji3 = Button3[1];
      const Emoji4 = Button4[1];
      const Emoji5 = Button5[1];
      const Emoji6 = Button6[1];
      const Emoji7 = Button7[1];
      const Emoji8 = Button8[1];
      

      await DB.findOneAndUpdate(
        { GuildID: guild.id },
        {
          Channel: Channel.id,
          Category: Category.id,
          Transcripts: Transcripts.id,
          Handlers: Handlers.id,
          Everyone: Everyone.id,
          Description: Description,
          Buttons: [Button1[0], Button2[0], Button3[0], Button4[0], Button5[0], Button6[0], Button7[0], Button8[0]],
        },
        {
          new: true,
          upsert: true,
        }
      );

      const Buttons = new MessageActionRow();
      Buttons.addComponents(
        new MessageButton()
          .setCustomId(Button1[0])
          .setLabel(Button1[0])
          .setStyle("PRIMARY")
          .setEmoji(Emoji1),
        new MessageButton()
          .setCustomId(Button2[0])
          .setLabel(Button2[0])
          .setStyle("SECONDARY")
          .setEmoji(Emoji2),
        new MessageButton()
          .setCustomId(Button3[0])
          .setLabel(Button3[0])
          .setStyle("PRIMARY") 
          .setEmoji(Emoji3),
        new MessageButton()
          .setCustomId(Button4[0])
          .setLabel(Button4[0])
          .setStyle("PRIMARY") 
          .setEmoji(Emoji4),
        new MessageButton()
          .setCustomId(Button5[0])
          .setLabel(Button5[0])
          .setStyle("PRIMARY") 
          .setEmoji(Emoji5),
      
      
     );
      const Button = new MessageActionRow();
      Button.addComponents(
        new MessageButton()
          .setCustomId(Button6[0])
          .setLabel(Button6[0])
          .setStyle("PRIMARY") 
          .setEmoji(Emoji6),
        new MessageButton()
          .setCustomId(Button7[0])
          .setLabel(Button7[0])
          .setStyle("PRIMARY") 
          .setEmoji(Emoji7),
        new MessageButton()
          .setCustomId(Button8[0])
          .setLabel(Button8[0])
          .setStyle("PRIMARY") 
          .setEmoji(Emoji8),
      )

      const Embed = new MessageEmbed()
        .setAuthor({
          name: guild.name + " | Ticketing System",
          iconURL: guild.iconURL({ dynamic: true }),
        })
        .setDescription(Description)
        .setColor("#36393f");

      await guild.channels.cache
        .get(Channel.id)
        .send({ embeds: [Embed], components: [Buttons, Button] });

      interaction.followUp({ content: "Done", ephemeral: true });
    } catch (err) {
      const errEmbed = new MessageEmbed().setColor("RED").setDescription(
        `⛔ | An error occured while setting up your ticket system\n**what to make sure of?**
          1. Make sure none of your buttons' names are duplicated
          2. Make sure you use this format for your buttons => Name,Emoji
          3. Make sure your button names do not exceed 200 characters
          4. Make sure your button emojis, are actually emojis, not ids.`
      );
      console.log(err);
      interaction.followUp({ embeds: [errEmbed] });
    }
  },
};