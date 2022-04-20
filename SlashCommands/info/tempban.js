const { MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = ({
	name: "tempban",
	description: "Temporarily ban a member from the server.",
	options: [
		{
			name: "member",
			description: "A member to tempban",
			type: "USER",
			required: true,
		},
		{
			name: "duration",
			description: "The duration for the tempban.",
			type: "STRING",
			required: true,
		},
		{
			name: "reason",
			description: "A reason for temporarily banning this member",
			type: "STRING",
			required: true,
		},
	],
	type: "CHAT_INPUT",
	run: async ( client, interaction) => {
     interaction.deferReply({ ephemeral: false }).catch(() => {})
		let user = interaction.options.getUser("member");
		let time = interaction.options.getString("duration");
		let reason = interaction.options.getString("reason");
		let member = interaction.guild.members.cache.get(user.id);

    let timeInMS = ms(time)
    if (!timeInMS) return interaction.followUp({ content: "The duration for the tempban is invalid. Try again." })

    

    await member.ban({ reason })
    let embed = new MessageEmbed()
      .setDescription(`\`(${user.id}) ${user.username}\` has been temporarily banned for ${time}`)
      .addField("`Reason`", `${reason}`)
      .setColor("RANDOM")
    interaction.channel.send({ embeds: [embed] })

    setTimeout(async () => {
      await interaction.guild.members.unban(member)


    
    }, timeInMS);
	},
});