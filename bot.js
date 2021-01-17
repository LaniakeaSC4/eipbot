const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
	//Are we alive?
	console.log('I am ready!');
});

//Define the things we are going to want to sort by
teams = ['egg-streme', 'yolksters','sunny-side','fowl-play','hard-boiled','over-easy'];
timezone = ['Europe', 'US WC', 'US EC', 'South America', 'Oceania'];
eggbonus = ['Medical Egger', 'Fusion Egger', 'Tachyon Egger', 'Antimatter Egger', 'Universe Egger', 'Enlightened Egger'];
permitstatus = ['Pro Permit', 'Standard Permit'];

//initiate some arrarys (so they will be global var)
var userroles = [];
var memberlist = [];
var memberdetails = [];

//arrays to build outputs into
var eggstremearr = [];
var yolkstersarr = [];
var sunnysidearr = [];
var fowlplayarr = [];
var hardboiledarr = [];
var overeasyarr = [];
//this one holds the names of the other arrays so we can loop through them
const allteamsarr = ['eggstremearr', 'yolkstersarr', 'sunnysidearr', 'fowlplayarr', 'hardboiledarr', 'overeasyarr'];

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

function buildteam(teamarray, teamfilter){
  
//build arrary specific for team-Egg-streme ready for output
//clear array before start
teamarray.splice(0,teamarray.length);

for (var i = 0; i < memberlist.length; i++) {
  if (memberlist[i][2] == teamfilter) {
  teamarray.splice(i,0,memberlist[i]);
}
} 
}

function update(message){
  
  	
		//we are going to need a counter incremented for each match below so that we can order things into the array
		var membuildcount = 0;
		var memlistcount = 0;
		
		//clear arrays on start
		memberdetails.splice(0,memberdetails.length);
memberlist.splice(0,memberlist.length);
	
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
		if (timepick.length == 0)
			{memberdetails.splice(membuildcount,0, "No Timezone")} 
				else {memberdetails.splice(membuildcount,0, String(timepick))}		
		membuildcount = membuildcount + 1;
		
		//Add team
		teampick = teams.filter(checkteam);
		if (teampick.length == 0)
			{memberdetails.splice(membuildcount,0, "No Team");}
				else {memberdetails.splice(membuildcount,0, String(teampick));}
		membuildcount = membuildcount + 1;

//Add egg bonus
bonuspick = eggbonus.filter(checkbonus);
if (bonuspick.length == 0)
{memberdetails.splice(membuildcount,0, "No Bonus");}
				else {memberdetails.splice(membuildcount,0, String(bonuspick));}
membuildcount = membuildcount + 1;

//Add permit status
permitpick = permitstatus.filter(checkpermit);
if (permitpick.length == 0)
{memberdetails.splice(membuildcount,0, "No Permit Status");}
				else {memberdetails.splice(membuildcount,0, String(permitpick));}
membuildcount = membuildcount + 1;
		

memberlist.splice(memlistcount,0, memberdetails);
memlistcount = membuildcount + 1;
membuildcount = 0;
memberdetails = [];
//memberdetails.splice(0,memberdetails.length);

	}//end for (let member of members) - every member on the server

//}// end loop for each team




//build arrary specific for team-Egg-streme ready for output
//clear array before start
//eggstremearr.splice(0,eggstremearr.length);

//for (var i = 0; i < memberlist.length; i++) {
 // if (memberlist[i][2] == "egg-streme") {
//  eggstremearr.splice(i,0,memberlist[i]);
//}
//} 

//for (var i = 0;i < allteamsarr.length;i++){
//buildteam(String(allteamsarr[i]),String(teams[i]))
//}

buildteam(eggstremearr, "egg-streme");
buildteam(yolkstersarr, "yolksters");




//update complete message
message.channel.send("Update Complete");

  
  
}

function prepupdate(color, title, description, array){
  
  const exampleEmbed = new Discord.MessageEmbed()
	.setColor(String(color))
	.setTitle(String(title))
	.setDescription(String(description));
for (var i = 0; i < array.length; i++) {

	exampleEmbed.addFields(
		{ name: array[i][0], value: 'Rank: ' + array[i][3] + '\n' + 'Time Zone: ' + array[i][1] + '\n' + 'Permit: ' + array[i][4], inline: true},
	);
}
return exampleEmbed;
}
//start update
client.on('message', async message => {

//look for !egg trigger
if (message.content.startsWith("!update")) {

update(message);
  
} //end !update trigger block
}); //end 'on message'


//start print to log
client.on('message', async message => {

//look for !eggstreme trigger
if (message.content.startsWith("!eggstreme")) {

update(message);

const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#B16DD0')
	.setTitle('Egg-streme')
	.setDescription('Here are the team members in Team Egg-streme!');
for (var i = 0; i < eggstremearr.length; i++) {

	exampleEmbed.addFields(
		{ name: eggstremearr[i][0], value: 'Rank: ' + eggstremearr[i][3] + '\n' + 'Time Zone: ' + eggstremearr[i][1] + '\n' + 'Permit: ' + eggstremearr[i][4], inline: true},
	);
} 
message.channel.send(exampleEmbed);

}

//look for !yolksters trigger
if (message.content.startsWith("!yolksters")) {

update(message);

const exampleEmbed = new Discord.MessageEmbed()
	.setColor('F0BA05')
	.setTitle('Yolksters')
	.setDescription('Here are the team members in Yolksters!');
for (var j = 0; j < yolkstersarr.length; j++) {

	exampleEmbed.addFields(
		{ name: yolkstersarr[j][0], value: 'Rank: ' + yolkstersarr[j][3] + '\n' + 'Time Zone: ' + yolkstersarr[j][1] + '\n' + 'Permit: ' + yolkstersarr[j][4], inline: true},
	);
} 
message.channel.send(exampleEmbed);

}


//look for !2 trigger
if (message.content.startsWith("!2")) {

update(message);
message.channel.send(prepupdate('#B16DD0' , 'Egg-streme', 'egg-streme members are', eggstremearr));

}




}); //end 'on message'


// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret 