const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	//Are we alive?
	console.log('I am ready!');
});

var userroles = [];

//Define the things we are going to want to sort by
teams = ['egg-streme', 'yolksters','sunny-side','fowl-play','hard-boiled','over-easy'];
timezone = ['Europe', 'US WC', 'US EC', 'South America', 'Oceania'];
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

	//check egg function
	function checkbonus(value) {
		for (var i = 0; i < userroles.length; i++) {
    		if (value.indexOf(userroles[i]) > -1) {
      		return true;
    			}
  		}
  		return false;
		}

	//check permit function
	function checkpermit(value) {
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
	
		//we are going to need a counter incremented for each match below so that we can order things into the array
		var membuildcount = 0;
	
//load up the members 
let members = message.guild.members.cache.array();
	
	//for every member on the server
	for(let member of members) {
	

	
		//start member details with display name. Splice it into the arrary at position of this loop.
		memberdetails.splice(membuildcount,0, member.displayName);
		membuildcount = membuildcount + 1;
		
		//first lets get all thier roles into a string
		userroles = member.roles.cache.map(r => r.name);

//Add timezone
timepick = timezone.filter(checktime);
console.log(timepick.length);
		
if (timepick.lenght === 0)
	{memberdetails.splice(membuildcount,0, 'No Timezone')} 
		else {memberdetails.splice(membuildcount,0, timepick)}		
membuildcount = membuildcount + 1;
		
//Add team
teampick = teams.filter(checkteam);
memberdetails.splice(membuildcount,0, teampick);		
membuildcount = membuildcount + 1;

//Add egg bonus
bonuspick = eggbonus.filter(checkbonus);
memberdetails.splice(membuildcount,0, bonuspick);		
membuildcount = membuildcount + 1;

//Add permit status
permitpick = permitstatus.filter(checkpermit);
memberdetails.splice(membuildcount,0, permitpick);		
membuildcount = membuildcount + 1;
		
	}//end for (let member of members) - every member on the server

//}// end loop for each team
} //end !egg trigger block
}); //end 'on message'


//start print to log
client.on('message', async message => {

//look for !egg trigger
if (message.content.startsWith("!print")) {
	
	console.log(memberdetails[0]);
	console.log(memberdetails[1]);
	console.log(memberdetails[2]);
	console.log(memberdetails[3]);
	console.log(memberdetails[4]);
	console.log(memberdetails[5]);
	console.log(memberdetails[6]);
	console.log(memberdetails[7]);
	console.log(memberdetails[8]);
	console.log(memberdetails[9]);
	console.log(memberdetails[10]);
	console.log(memberdetails[11]);
	console.log(memberdetails[12]);
	console.log(memberdetails[13]);
	console.log(memberdetails[14]);
	console.log(memberdetails[15]);
	console.log(memberdetails[16]);
	console.log(memberdetails[17]);
	console.log(memberdetails[18]);
	console.log(memberdetails[19]);
	console.log(memberdetails[20]);
	console.log(memberdetails[21]);
	console.log(memberdetails[22]);
	console.log(memberdetails[23]);
	console.log(memberdetails[24]);
	console.log(memberdetails[25]);
	console.log(memberdetails[26]);
	console.log(memberdetails[27]);
	console.log(memberdetails[28]);
	console.log(memberdetails[29]);
	console.log(memberdetails[30]);
	console.log(memberdetails[31]);
	console.log(memberdetails[32]);
	console.log(memberdetails[33]);
}
}); //end 'on message'


// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret
