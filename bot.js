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
teams = ['egg-streme', 'yolksters'];
timezone = ['Europe', 'US-WC', 'US-EC', 'South America', 'Oceania'];
eggbonus = ['Medical Egger', 'Fusion Egger', 'Tachyon Egger', 'Antimatter Egger', 'Universe Egger', 'Enlightened Egger'];
permitstatus = ['Pro Permit', 'Standard Permit'];
	
//This will be the top level arrary for each team
var teamarray = [];

//each object in teamarrary will be an arrary of the member display names
var memberarray = [];

//for each memberarray we will have another arrary containing the members details. Timezone, EB, Permit
var memberdetails = [];
	
	//for every member on the server
	for(let member of members) {
	
		//we are going to need a counter incremented for each match below so that we can order things into the array
		var membuildcount = 0;
	
		//start member details with display name. Splice it into the arrary at position of this loop.
		memberdetails.splice(membuildcount,0, member.displayName);
		membuildcount = membuildcount + 1;
		
		//first lets get all thier roles into a string
		userroles = member.roles.cache.map(r => '`'+r.name+'`');
	  	
//var arr = ['banana', 'monkey banana', 'apple', 'kiwi', 'orange'];

function checkteam(value) {
	
	
 for (var i = 0; i < userroles.length; i++) {
	  //(value.indexOf(prohibited[i]) > -1) 
    if (value.indexOf(userroles[i]) > -1)) {
      return true;
    }
  }
  return false;
}

thisteam = teams.filter(checkteam);
console.log(member.displayName + "'s teams is: " + thisteam);
		
		
		
		
		
		//Now we need to build memberdetails and store it in member arrary
		//var found = 0;
		//var tm
		//for (tm = 0; tm < teams.length;tm++){
	  	
	  	//	if (userroles.includes(teams[tm])) {
	  	//	console.log("Team matched :" + teams[tm]);
		//	found = 1;
		//	membuildcount = membuildcount + 1;
		//	}
		//}		
		
		//if(found = 0){ for (tm = 0; tm < teams.length;tm++){
	  	
	  	//	if (!userroles.includes(teams[tm]); && found = 0) {
	  	//	console.log("No Match");
		//	membuildcount = membuildcount + 1;
		//	found = 1;
		//	}
		//}
		//	     }
		//found = 0;
		
		//var eb
		//for (eb = 0; eb < eggbonus.length;eb++){
	  	
	  	//	if (userroles.includes(eggbonus[eb])){
	  	//	memberdetails.splice(membuildcount,0, 'EB: ' + eggbonus[eb]);
		//	membuildcount = membuildcount + 1;
		//	} 
		//}
	
		//var tz;
		//for (tz = 0; tz < timezone.length;tz++){
			
		//	if (userroles.includes(timezone[tz])){
	  	//	memberdetails.splice(membuildcount,0, 'TZ: ' + timezone[tz]);
		//	membuildcount = membuildcount + 1;
	  	//	} 
	
		//}
		
		//var ps;
		//for (ps = 0; ps < permitstatus.length;ps++){
			
		//	if (userroles.includes(permitstatus[ps])){
	  	//	memberdetails.splice(membuildcount,0, 'PS: ' + permitstatus[ps]);
		//	membuildcount = membuildcount + 1;
	  	//	}

		//}
		
	};//end for (let member of members) - every member on the server

//}// end loop for each team
} //end !egg trigger block
}); //end 'on message'



// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret
