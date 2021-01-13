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

//Define the things we are going to want to sort by
teams = ['egg-streme', 'yolksters']
timezones = ['Europe', 'US-WC', 'US-EC', 'South America', 'Oceania']
eggbonus = ['Medical Egger', 'Fusion Egger', 'Tachyon Egger', 'Antimatter Egger', 'Universe Egger', 'Enlightened Egger']
permitstatus = ['Pro Permit', 'Standard Permit']
	
//This will be the top level arrary for each team
const teamarray = [];

//each object in teamarrary will be an arrary of the member display names
const memberarray = [];

//for each memberarray we will have another arrary containing the members details. Timezone, EB, Permit
const memberdetails = [];

//starting loop for each team
var i
for (i = 0; i < teams.length; i++){

//pop a team to get started
thisteam = teams.pop();

	//this loop is for thisteam
	let role = message.guild.roles.cache.find(r => r.name === thisteam);
	
	//for every member on the server
	for(let member of members) {
	//check who are in the team for this loop
   	let hasRole = member.roles.cache.has(role.id);
	//if they are in this team
	if (hasRole === true){
		//start member details with display name
		memberdetails.push(${member.displayName});
		console.log('Memberdetails array ' + memberdetails);
		
		//first lets get all thier roles into a string
		userroles = member.roles.cache.map(r => '`'+r.name+'`').join(' - ');
	  	
		//Now we need to build memberdetails and store it in member arrary
		//[here] start a for loop, for the length of eggbonus. Check each one against the userroles string
		if (userroles.includes('Europe')){
   
	   console.log(`${member.displayName}: is ` + thisteam + ' and has ' + userroles);
	   //message.channel.send(`${member.displayName}: is ` + thisteam + ' and has ' + userroles);
 };
//else { 
  //console.log(`${member.id}: is not found`)};
};
};
teams.unshift(thisteam);
};
}; //end !egg trigger block
}); //end 'on message'

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret
