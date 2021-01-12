const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	//Are we alive?
	console.log('I am ready!');
});

//start
client.on('message', async message => {

//look for !egg trigger
if (message.content.startsWith("!egg")) {

	let members = message.guild.members.cache.array();
	let role = message.guild.roles.cache.find(r => r.name === 'egg-streme');
	
	for(let member of members) {
   	let hasRole = member.roles.cache.has(role.id);
 if (hasRole === true){
	   console.log(`${member.id}: is egg-streme`)
 } 
else { console.log(`${member.id}: is not egg-streme`)};
} 
//teams.unshift(therole);

}; //end !egg trigger block
}); //end 'on message'

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret
