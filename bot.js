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

//load up the members 
let members = message.guild.members.cache.array();

//add loop here? For each role
teams = ['egg-streme', 'yolksters']
timezones = ['Europe', 'US-WC', 'US-EC', 'South America']


var i
for (i = 0; i < teams.length; i++){

thisteam = teams.pop();

	let role = message.guild.roles.cache.find(r => r.name === thisteam);
	
	for(let member of members) {
   	let hasRole = member.roles.cache.has(role.id);
 if (hasRole === true){
	   userroles = member.roles.cache.map(r => '`'+r.name+'`').join(' - ');
	  //console.log(userroles);
	   
	   //console.log(`${member.displayName}: is ` + thisteam + ' and has ' + userroles);
	   client.message.send(`${member.displayName}: is ` + thisteam + ' and has ' + userroles)
 } 
//else { 
  //console.log(`${member.id}: is not found`)};
};
teams.unshift(thisteam);
};
}; //end !egg trigger block
}); //end 'on message'

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret
