const { MessageEmbed, CommandInteraction } = require('discord.js')
const ms = require("ms")


module.exports = {
    name: "slowmode",
    description: "Slowmode Command",
    options: [
        {
            name: "amount",
            description: "Amount Of Slowmode",
            type: "STRING",
            required: true
        }
    ],
    /**
     * 
     * @param { CommandInteraction } interaction 
     */
     async run(client, interaction, options) {
        let row = interaction.options.getString("amount");
        const mile = ms(row);

        if (isNaN(mile)) return interaction.followUp({content: " Give a valid One", ephemeral: true})

        if (mile < 1000) return interaction.followUp({content: "The Slow Mode is Min 1sec !", ephemeral: true})

        if (mile > 21600) return interaction.followUp({content: "The Slow Mode Is Above the Limit", ephemeral: true})

        interaction.channel.setRateLimitPerUser(mile / 1000);

        interaction.followUp({embeds: [new MessageEmbed().setColor("RANDOM").setDescription(`The SlowMode in this channel has been set to ${ms(mile)}`)]})

    }
}

