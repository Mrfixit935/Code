const { MessageEmbed, Message, WebhookClient } = require("discord.js");
const client = require("../index");

client.on("messageDelete", async (message) => {
    /**
     * @param {Message} message 
     */
    
        if(message.author.bot) return;

        const Log = new MessageEmbed()
        .setColor("#36393f")
        .setDescription(`📕 A [message](${message.url}) by ${message.author.tag} was **deleted**.\n
        **Deleted Message:**\n ${message.content ? message.content : "None"}`.slice(0, 4096))
        
        if(message.attachments.size >= 1){
            Log.addField(`Attachments:`, `${message.attachments.map(a => a.url)}`, true)
        }
        
        new WebhookClient({url: ""}
        ).send({embeds: [Log]}).catch((err) => { console.log(err)});

    })