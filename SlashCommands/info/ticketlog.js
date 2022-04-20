const Discord = require("discord.js")
module.exports = {
  name: 'ticket-log',
  description: 'Log a Ticket',
  options: [
      {
      name: 'user',
      description: 'Please provide the members name and Tag.',
      type: 'USER',
      required: true
    },
    {
      name: 'number',
      description: 'Ticket Number?',
      type: 'STRING',
      required: true
    },
    {
      name: 'panel',
      description: 'Ticket Panel?',
      type: 'STRING',
      required: true
    },
      {
      name: 'assistance',
      description: 'Who Assisted?',
      type: 'STRING',
      required: true
    },
    {
      name: 'paid',
      description: 'How much paid?',
      type: 'STRING',
      required: true
    },
   
  ],
  async run(client, interaction)  {
    const Username = interaction.options.getUser('user');
    const rank1 = interaction.options.getString('number');
    const panel = interaction.options.getString('panel');
    const assistance = interaction.options.getString('assistance');
    const paid = interaction.options.getString('paid');

await interaction.client.channels.cache.get("916155737590345748")?.send({ embeds: [
    new Discord.MessageEmbed()
            .setColor("#ff0000")
            .addField('**__New Ticket Log__**', '-------------------------')
            .addField('**Staff Discord Name and Tag__**', '' + interaction.user.tag + '')
            .addField('**__Customer Discord Name__**', Username)
            .addField('**__Panel__**', panel)
            .addField('**__Ticket Number__**', rank1)
            .addField('**__Assistance__**', assistance)
            .addField('**__Paid__**', paid)
] });
    return await interaction.followUp({ 
          embeds: [
              new Discord.MessageEmbed()
            .setColor("#ff0000")
            .addField('**__New Ticket Log__**', '-------------------------')
            .addField('**Staff Discord Name and Tag__**', '' + interaction.user.tag + '')
            .addField('**__Customer Discord Name__**', Username)
            .addField('**__Panel__**', panel)
            .addField('**__Ticket Number__**', rank1)
            .addField('**__Assistance__**', assistance)
            .addField('**__Paid__**', paid)
          ], ephemeral: true 
      })
}

};