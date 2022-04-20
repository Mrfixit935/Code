const Discord = require("discord.js")
const db = require("quick.db")
const moment = require("moment")
let random_string = require("randomstring")
const { MessageEmbed } = require('discord.js');


module.exports = {
    name:"strike",
    description:"Strike users",
    options: [
    {
      name: 'user',
      description: 'I need their user.',
      type: 'USER',
      required: true
    },
    {
      name: 'reason',
      description: 'I need the reason?',
      type: 'STRING',
      required: true
    },
 
  ],
}

run: async (client, interaction, args) => {

             if (!interaction.member.permissions.has('ADMINISTRATOR')) {
      return interaction.followUp({  content: ':x: You need to have the Manage Messages permissions to warn.'});
    }

    const user = interaction.options.getUser('user');
    const res = interaction.options.getString('reason');


   //LETS GO

if(interaction.guild.members.cache.get(user.id).roles.highest.position > interaction.member.roles.highest.position) return interaction.followUp(":x: Can't warn")
   if(!user) return interaction.followUp(":x: You must tag a user")


   let warnID = await  
   random_string.generate({
     charset: 'numeric',
     length:8
   });
   

   console.log(`${user.id} warned ID: ${warnID}`)

 interaction.followUp("User has been warned!")
   db.push(`info.${user.id}`,{moderator:interaction.user.tag , reason:res ? res : "N/A" , date:moment().format("YYYY-MM-DD"),id: 'STRIKE-' + warnID})
   db.add(`number.${user.id}`,1)
   
   


let logembed = new Discord.MessageEmbed()
            .setColor("#ff0000")
            .addField('**__New Strike Log__**', '-------------------------')
            .addField('**Striker Discord Name and Tag__**', interaction.user.tag)
            .addField('**__Discord Name__**', user)
            .addField('**__Strike ID__**', 'STRIKE-' + warnID)
            .addField('**__Reason__**', res)


await interaction.client.channels.cache.get("927580240866324511")?.send({ embeds: [logembed] });



}