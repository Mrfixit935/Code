const { Client, Collection, MessageEmbed } = require("discord.js");
const fs = require('fs');
const config = require("./config.json");
const Discord = require("discord.js")


const client = new Client({
    intents: 32767,
});
module.exports = client;

// Global Variables
client.commands = new Collection();
client.slashCommands = new Collection();
client.filters = new Collection();
client.filtersLog = new Collection();
client.config = require("./config.json");
const prefix = require("./config.json");


// Initializing the project
require("./handler")(client);
require("./Systems/ChatFilterSys")(client);
require('./Systems/GiveawaySys')(client);
//require("./handler/Anti-crash")(client);





const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");

client.distube = new DisTube(client, {
  emitNewSongOnly: true,
  leaveOnFinish: true,
  emitAddSongWhenCreatingQueue: false,
  plugins: [new SpotifyPlugin()]
});



const { Database } = require("./config.json");
const memberCount = require('./events/member-count');
const mongoose = require("mongoose");


 
client.on('ready', () => {
    console.log(`The ${client.user.tag} is now ready!`);
    client.user.setActivity("Developer Productions", { type: "WATCHING" });
     //client.user.setStatus("idle");
     memberCount(client)

    if(!Database) return;
    mongoose.connect(Database, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
      console.log("The client is now connected to the database!")
    }).catch((err) => {
      console.log(err);
    });
  },
);






client.on('guildMemberRemove', (member) => {
  member.guild.channels.cache.get("888749809584979998").send(`${member.user} has left the server!`);

})





client.on('guildMemberAdd', (member) => {
  		// member.guild.channels.cache.get("849283385808912384").send(`${member.user} has joined the server!`);
      //console.log(member.user);

      const newMemberEmbed = new Discord.MessageEmbed()
        .setColor("#d81e5b")
        .setTitle("New Member!")
        .setDescription(`${member.user} has joined the server! We hope you enjoy your stay! ID ${member.user.id} make sure to join our roblox group https://www.roblox.com/groups/12377029/Developer-Support#!/about`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp();
      
  
  
        member.guild.channels.cache.get("888749785681657927").send({
          embeds: [newMemberEmbed] 
        })
  

      
        
    })
  
client.login(client.config.token);


