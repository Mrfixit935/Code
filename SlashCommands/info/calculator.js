const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'calculator',
    description: 'Helps you solve a math problem',
    /** 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */
    run: async(client, message, args) => {
        const simplydjs = require("simply-djs")
        simplydjs.calculator(message,{
            embedColor:"YELLOW"
        })

    }
}