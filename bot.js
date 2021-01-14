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
teams = ['egg-streme'];
timezone = ['Europe', 'US-WC', 'US-EC', 'South America', 'Oceania'];
eggbonus = ['Medical Egger', 'Fusion Egger', 'Tachyon Egger', 'Antimatter Egger', 'Universe Egger', 'Enlightened Egger'];
permitstatus = ['Pro Permit', 'Standard Permit'];
	
//This will be the top level arrary for each team
const teamarray = [];

//each object in teamarrary will be an arrary of the member display names
const memberarray = [];

//for each memberarray we will have another arrary containing the members details. Timezone, EB, Permit
const memberdetails = [];

//starting loop for each team
var i;
for (i = 0; i < teams.length; i++){

//pop a team to get started
thisteam = teams.pop();

	//this loop is for thisteam
	let role = message.guild.roles.cache.find(r => r.name === thisteam);
	
	//for every member on the server
	for(let member of members) {
	//check who are in the team for this loop
   	let hasRole = member.roles.cache.has(role.id);
	
	//we are going to need a counter incremented for each match below so that we can order things into the array
	buildcount = 0;
	
	//if they are in this team
	if (hasRole === true){
		
		//I think these next 4 rows need to go after all the role examination. memberarray[0] should contain (in this order) ['displayname', 'eggrank','permit','timezone']
		//start member details with display name. Splice it into the arrary at position of this loop.
		memberdetails.splice(buildcount,0, member.displayName);
		//console.log('Memberdetails array ' + memberdetails[buildcount]);
		buildcount = buildcount + 1;
		
		//first lets get all thier roles into a string
		userroles = member.roles.cache.map(r => '`'+r.name+'`').join(' - ');
	  	
		//Now we need to build memberdetails and store it in member arrary
		//[here] start a for loop, for the length of eggbonus. Check each one against the userroles string
		
	var eb
	for (eb = 0; eb < eggbonus.length;eb++){
	  
	  if (userroles.includes(eggbonus[eb])){
	  memberdetails.splice(buildcount,0, eggbonus[eb]);
		//console.log('eggbonus: ' + memberdetails[buildcount]);
		buildcount = buildcount + 1;
	} 
	}
	 var tz;
	for (tz = 0; tz < timezone.length;tz++){
	  
	  if (userroles.includes(timezone[tz])){
	  memberdetails.splice(buildcount,0, timezone[tz]);
		//console.log('timezone: ' + memberdetails[buildcount]);
		buildcount = buildcount + 1;

	  }
	
}


}
teams.unshift(thisteam);
console.log(memberdetails);
}


}


} //end !egg trigger block
}); //end 'on message'



// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret
