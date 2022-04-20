const client = require("../index");
const { Message, MessageEmbed } = require("discord.js");


client.on("messageCreate", async (message) => {

  /**
   * @param {Message} message
   * @param {Client} client
   */
    if (message.author.bot) return;

    const { content, guild, author, channel } = message;
    const messageContent = content.toLowerCase().split(" ");

    const Filter = client.filters.get(guild.id);
    if (!Filter) return;

    const wordsUsed = [];
    let shouldDelete = false;

    messageContent.forEach((word) => {
      if (Filter.includes(word)) {
        wordsUsed.push(word);
        shouldDelete = true;
      }
    });

    if (shouldDelete) message.delete().catch(() => {});

    if (wordsUsed.length) {
      const channelID = client.filtersLog.get(guild.id);
      if (!channelID) return;
      const channelObject = guild.channels.cache.get(channelID);
      if (!channelObject) return;

      const Embed = new MessageEmbed()
        .setColor("RED")
        .setAuthor({
          name: author.tag,
          iconURL: author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          [
            `Used ${wordsUsed.length} blacklisted word(s) in ${channel} =>`,
            `\`${wordsUsed.map((w) => w)}\``,
          ].join("\n")
        );

      channelObject.send({ embeds: [Embed] });
    }
})
