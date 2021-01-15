const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	//Are we alive?
	console.log('I am ready!');
});

//Define the things we are going to want to sort by
teams = ['egg-streme', 'yolksters','sunny-side','fowl-play','hard-boiled','over-easy'];
timezone = ['Europe', 'US-WC', 'US-EC', 'South America', 'Oceania'];
eggbonus = ['Medical Egger', 'Fusion Egger', 'Tachyon Egger', 'Antimatter Egger', 'Universe Egger', 'Enlightened Egger'];
permitstatus = ['Pro Permit', 'Standard Permit'];

//functions
	//check team function
	function checkteam(value) {
		for (var i = 0; i < userroles.length; i++) {
    		if (value.indexOf(userroles[i]) > -1) {
      		return true;
    			}
  		}
  		return false;
		}

	//check time function
	function checktime(value) {
		for (var i = 0; i < userroles.length; i++) {
    		if (value.indexOf(userroles[i]) > -1) {
      		return true;
    			}
  		}
  		return false;
		}

//for each memberarray we will have another arrary containing the members details. Timezone, EB, Permit
var memberdetails = [];

//start update
client.on('message', async message => {

//look for !egg trigger
if (message.content.startsWith("!update")) {

//load up the members 
let members = message.guild.members.cache.array();
	
	//for every member on the server
	for(let member of members) {
	
		//we are going to need a counter incremented for each match below so that we can order things into the array
		var membuildcount = 0;
	
		//start member details with display name. Splice it into the arrary at position of this loop.
		memberdetails.splice(membuildcount,0, member.displayName);
		membuildcount = membuildcount + 1;
		
		//first lets get all thier roles into a string
		userroles = member.roles.cache.map(r => r.name);

//Add team
teampick = teams.filter(checkteam);
memberdetails.splice(membuildcount,0, teampick);		
//console.log(memberdetails);
membuildcount = membuildcount + 1;

//Add timezone
timepick = teams.filter(checktime);
memberdetails.splice(membuildcount,0, timepick);		
//console.log(memberdetails);
membuildcount = membuildcount + 1;
		
	}//end for (let member of members) - every member on the server

//}// end loop for each team
} //end !egg trigger block
}); //end 'on message'


//start print to log
client.on('message', async message => {

//look for !egg trigger
if (message.content.startsWith("!print")) {
	
console.log(memberdetails);
}
}); //end 'on message'


// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret
