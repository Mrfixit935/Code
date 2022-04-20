const Discord = require("discord.js")
module.exports = {
  name: 'log-promotion',
  description: 'Log a Promotion',
    options: [
    {
      name: 'user_tag',
      description: 'Please provide the Staff members name and Tag.',
      type: 'STRING',
      required: true
    },
    {
      name: 'old_rank',
      description: 'Old Rank?',
      type: 'STRING',
      required: true
    },
      {
      name: 'new_rank',
      description: 'New rank.',
      type: 'STRING',
      required: true
    },
    {
      name: 'reason',
      description: 'Reason?',
      type: 'STRING',
      required: true
    },
   
  ],
   async run(client, interaction)  {
    const Username = interaction.options.getString('user_tag');
    const rank1 = interaction.options.getString('old_rank');
    const rank2 = interaction.options.getString('new_rank');
    const meh = interaction.options.getString('reason');

                          
let embed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .addField('**__New Promotion Log__**', '-------------------------')
            .addField('**__Logger Discord Name and Tag__**', '' + interaction.user.tag + '')
            .addField('**__Discord Name__**', Username)
            .addField('**__New Rank__**', rank2)
            .addField('**__Old Rank__**', rank1)
            .addField('**__Reason__**', meh)


await interaction.client.channels.cache.get("927580240866324511")?.send({ embeds: [embed] });
      interaction.followUp({ embeds: [embed] })
}

};