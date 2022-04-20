const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
name: 'wordle',
description: 'Play a game of wordle',
run: async (client, interaction, args) => {
let errEmbed = new MessageEmbed()
.setColor("#6F8FAF")

const gamedesc = [
`⬛⬛⬛⬛⬛ - Empty`,
`⬛⬛⬛⬛⬛ - Empty`,
`⬛⬛⬛⬛⬛ - Empty`,
`⬛⬛⬛⬛⬛ - Empty`,
`⬛⬛⬛⬛⬛ - Empty`,
`⬛⬛⬛⬛⬛ - Empty`
]

let game = new MessageEmbed()
.setTitle(` Wordle`)
.setDescription(gamedesc.join('\n'))
.setFooter({ text: `You Have 6 Tries To Guess The Word`})
.setColor("#6F8FAF")
  
interaction.followUp({ embeds: [game]})
  
let options = {
yellow: `🟨`,
grey: `⬜`,
green: `🟩`,
black: `⬛`,
}

var tries = 0;
let words = ["books","apple","color","ready","house","table","light","sugar","eager","elite", "plant", "stamp","spawn"]
let solution = words[Math.floor(Math.random() * words.length)];

const filter = m => m.author.id === interaction.user.id;
const msgCollector = interaction.channel.createMessageCollector({ filter, time: 50000});

msgCollector.on('collect', async m => {
if(m.author.bot)return
let guess = m.content.toLowerCase();
if(guess.length > 5 || guess.length < 5)return;
var result = "";
for (let i = 0; i < guess.length; i++) {
let guessLetter = guess.charAt(i);
let solutionLetter = solution.charAt(i);
if (guessLetter === solutionLetter) {
result = result.concat(options.green)
}
else if (solution.indexOf(guessLetter) != -1) {
result = result.concat(options.yellow)
}
else {
result = result.concat(options.grey)
}
}
if(result === "🟩🟩🟩🟩🟩"){
gamedesc[tries] = `${result} - ${guess}`;
interaction.editReply({ embeds: [game.setDescription(gamedesc.join('\n'))]})
interaction.editReply({ embeds: [game.setFooter({ text: `You Got The Correct Word`})]})
return msgCollector.stop();
}else{
msgCollector.resetTimer();
gamedesc[tries] = `${result} - ${guess}`;
interaction.editReply({ embeds: [game.setDescription(gamedesc.join('\n'))]})
tries += 1
if(tries === 6){
interaction.editReply({ embeds: [game.setFooter({ text: `You Used Your 6 Tries The Correct Word Was ${solution}`})]})
return msgCollector.stop();
}
}
});
},
};
