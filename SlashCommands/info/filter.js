const { CommandInteraction, Client } = require("discord.js");
const Schema = require("../../Schemas/FIlterDB");

module.exports = {
  name: "filter",
  description: "A simple chat filtering system.",
  options: [
    {
      name: "settings",
      description: "Setup your filtering system.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "logging",
          description: "Select the logging channel.",
          type: "CHANNEL",
          channelTypes: ["GUILD_TEXT"],
          required: true,
        },
      ],
    },
    {
      name: "configure",
      description: "Add or remove words from the blacklist.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "options",
          description: "Select an option.",
          type: "STRING",
          required: true,
          choices: [
            { name: "Add", value: "add" },
            { name: "Remove", value: "remove" },
          ],
        },
        {
          name: "word",
          description:
            "Provide the word, add multiple words by placeing a comma in between (word,anotherword)",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],
  /**
   *
   * @param {CommandInteraction} interaction
   * @param {Client} client
   */
  async run(client, interaction) {
    const { guild, options } = interaction;

    const subCommand = options.getSubcommand();

    switch (subCommand) {
      case "settings":
        const loggingChannel = options.getChannel("logging").id;

        await Schema.findOneAndUpdate(
          { Guild: guild.id },
          { Log: loggingChannel },
          { new: true, upsert: true }
        );

        client.filtersLog.set(guild.id, loggingChannel);

        interaction.followUp({
          content: `Added <#${loggingChannel}> as the logging channel for the filtering system.`,
          ephemeral: true,
        });
        break;
      case "configure":
        const Choice = options.getString("options");
        const Words = options.getString("word").toLowerCase().split(",");

        switch (Choice) {
          case "add":
            Schema.findOne({ Guild: guild.id }, async (err, data) => {
              if (err) throw err;
              if (!data) {
                await Schema.create({
                  Guild: guild.id,
                  Log: null,
                  Words: Words,
                });

                client.filters.set(guild.id, Words);

                return interaction.followUp({
                  content: `Added ${Words.length} new word(s) to the blacklist.`,
                });
              }

              const newWords = [];

              Words.forEach((w) => {
                if (data.Words.includes(w)) return;
                newWords.push(w);
                data.Words.push(w);
                client.filters.get(guild.id).push(w);
              });

              interaction.followUp({
                content: `Added ${newWords.length} new word(s) to the blacklist.`,
              });

              data.save();
            });
            break;
          case "remove":
            Schema.findOne({ Guild: guild.id }, async (err, data) => {
              if (err) throw err;
              if (!data) {
                return interaction.followUp({
                  content: "There is no data to remove!",
                });
              }

              const removedWords = [];

              Words.forEach((w) => {
                if (!data.Words.includes(w)) return;
                data.Words.remove(w);
                removedWords.push(w);
              });

              const newArray = await client.filters
                .get(guild.id)
                .filter((word) => !removedWords.includes(word));

              client.filters.set(guild.id, newArray);

              interaction.reply({
                content: `Removed ${removedWords.length} word(s) from the blacklist.`,
              });
              data.save();
            });
            break;
        }
        break;
    }
  },
};
