const { CommandInteraction, MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const DB = require("../../Schemas/SuggestDB");

module.exports = {
    name: "suggest",
    description: "Make a suggestion.",
    options: [
        {
            name: "type",
            description: "Select the type of the suggestion",
            type: "STRING",
            required: true,
            choices: [
                {name: "Command", value: "Command"},
                {name: "Roblox Game", value: "Game"},
                {name: "Discord Server", value: "Discord Server"},
                {name: "Other", value: "Other"}
            ]
        },
        {
            name: "suggestion",
            description: "Describe the functionality of the suggestion.",
            type: "STRING",
            required: true
        },
        
    ],
    /**
     * @param {CommandInteraction} interaction 
     */
    async run(client, interaction) {
        const { options, guildId, member, user } = interaction;

        const cType = options.getString("type");
        const cSuggestion = options.getString("suggestion");

        const Embed = new MessageEmbed()
        .setColor("NAVY")
        .setAuthor(user.tag, user.displayAvatarURL({dynamic: true}))
        .addFields(
            {name: "Suggestion:", value: cSuggestion, inline: false},
            {name: "Type:", value: cType, inline: true},
            {name: "Status:", value: "Pending", inline: true},
        )

        const cButtons = new MessageActionRow();
        cButtons.addComponents(
            new MessageButton().setCustomId("suggest-accept").setLabel("✅ Accept").setStyle("PRIMARY"),
            new MessageButton().setCustomId("suggest-decline").setLabel("⛔ Decline").setStyle("SECONDARY"),
        );

        try {
            await interaction.followUp({embeds: [Embed], components: [cButtons], fetchReply: true}).then(async (m) => {
                await DB.create({GuildID: guildId, MessageID: m.id, Details: [
                    {   
                        MemberID: member.id,
                        Type: cType,
                        Suggestion: cSuggestion
                    }
                ]}).catch((err) => console.log(err));

            })

        } catch(err) {
            console.log(err)
        }
    }
}
