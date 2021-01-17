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

//functions
//check functions: When looping through each member in update function, these functions look through the users roles (userroles) and return true for the role which matches. 

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

//member details are first stored in memberdetails, then stored in 2 dimension memberlist. Buildteam function adds the member objects from memberlist (containing member details) to a team specific array ready for processing to output.
function buildteam(teamarray, teamfilter){
 
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
	

	
		//start member details with display name. Splice it into the arrary at position membuildcount (0) counter then increment membuildcount so next object goes in next position. .
		memberdetails.splice(membuildcount,0, member.displayName);
		membuildcount = membuildcount + 1;
		
		//now lets get all thier roles into a string
		userroles = member.roles.cache.map(r => r.name);

		//Add timezone using checktime function.
		//fill timepick with objects from the timezone list which pass checktime as true (should just be one match). Splice it into the next location of memberdetails then increment build count.
		timepick = timezone.filter(checktime);
		if (timepick.length == 0)
			{memberdetails.splice(membuildcount,0, "No Timezone")} 
				else {memberdetails.splice(membuildcount,0, String(timepick))}		
		membuildcount = membuildcount + 1;
		
		//Add team with checkteam function (see timepick)
		teampick = teams.filter(checkteam);
		if (teampick.length == 0)
			{memberdetails.splice(membuildcount,0, "No Team");}
				else {memberdetails.splice(membuildcount,0, String(teampick));}
		membuildcount = membuildcount + 1;

//Add egg bonus with checkbonus function (see timepick)
bonuspick = eggbonus.filter(checkbonus);
if (bonuspick.length == 0)
{memberdetails.splice(membuildcount,0, "No Bonus");}
				else {memberdetails.splice(membuildcount,0, String(bonuspick));}
membuildcount = membuildcount + 1;

//Add permit status with checkpermit function (see timepick)
permitpick = permitstatus.filter(checkpermit);
if (permitpick.length == 0)
{memberdetails.splice(membuildcount,0, "No Permit Status");}
				else {memberdetails.splice(membuildcount,0, String(permitpick));}
membuildcount = membuildcount + 1;
		
//now we have all user details in memberdetails [0] to [4], splice all that as one object into memberlist. 
memberlist.splice(memlistcount,0, memberdetails);
//increment memlistcount ready for next loop/user
memlistcount = membuildcount + 1;
//reset membuild count
membuildcount = 0;
//this may not be needed. Try take it out? 
memberdetails = [];

	}//end for (let member of members) - every member on the server

//build the team specific arrays
buildteam(eggstremearr, "egg-streme");
buildteam(yolkstersarr, "yolksters");
buildteam(sunnysidearr, "sunny-side");
buildteam(fowlplayarr, "fowl-play");
buildteam(hardboiledarr, "hard-boiled");
buildteam(overeasyarr, "over-easy");

//end update function
}

//this function builds and returns the discord embed
function prepupdate(color, title, description, array){
  
  const exampleEmbed = new Discord.MessageEmbed()
	.setColor(String(color))
	.setTitle(String(title))
	.setDescription(String(description));

	//loop to add the team members to the rich embed. Team specific array contains object for each member, so we loop through them to ad fields to the embed. 
for (var i = 0; i < array.length; i++) {

	exampleEmbed.addFields(
		{ name: array[i][0], value: 'Rank: ' + array[i][3] + '\n' + 'Time Zone: ' + array[i][1] + '\n' + 'Permit: ' + array[i][4], inline: true},
	);
} 
//return embed back to caller
return exampleEmbed;

} 
//end of functions

//======================================

//look for messages, when one is sent do
client.on('message', async message => {

//look for !update trigger. Allows manual update. Not needed with team outputs as update function is called first in those anyway.
if (message.content.startsWith("!update")) {

//updates all the arrays, passing message details to the function. 
update(message);
message.channel.send("Teams updated");
message.delete();
} //end !update trigger block

//look for !yolksters trigger
if (message.content.startsWith("!yolksters")) {

update(message);
message.channel.send(prepupdate('#F0BA05' , 'Yolksters', 'Here are the team members in team Yolksters!', yolkstersarr));
}

//look for !eggstreme trigger
if (message.content.startsWith("!eggstreme")) {

update(message);
message.channel.send(prepupdate('#B16DD0' , 'Egg-streme', 'Here are the team members in team Egg-streme!', eggstremearr));
}

//look for !sunnyside trigger
if (message.content.startsWith("!sunnyside")) {

update(message);
message.channel.send(prepupdate('#DFD370' , 'Sunny-side', 'Here are the team members in team Sunny-side!', sunnysidearr));
}

//look for !fowlplay trigger
if (message.content.startsWith("!fowlplay")) {

update(message);
message.channel.send(prepupdate('#1865F5' , 'Fowl-play', 'Here are the team members in team Fowl-play!', fowlplayarr));
}

//look for !hardboiled trigger
if (message.content.startsWith("!hardboiled")) {

update(message);
message.channel.send(prepupdate('#5C90E1' , 'Hard Boiled', 'Here are the team members in team Hard Boiled!', hardboiledarr));
} 

//look for !overeasy trigger
if (message.content.startsWith("!overeasy")) {

update(message);
message.channel.send(prepupdate('#A822BD' , 'Over Easy', 'Here are the team members in team Over Easy!', overeasyarr));
} 

}); //end 'on message'


// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret 