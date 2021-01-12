const Discord = require('discord.js');
const client = new Discord.Client();

//build team array
var teams = [ 'egg-streme' ];

client.on('ready', () => {
	//Are we alive?
	console.log('I am ready!');
});

//start
client.on('message', async message => {

//look for !egg trigger
if (message.content.startsWith("!egg")) {
       
//Set number of loops equal to number of roles in the teams arrary
var roleloops
for (roleloops = 0;roleloops < teams.length; roleloops++){

//pop a role to work with for this loop
const therole = teams.pop();

//find role for this loop
const Role = message.guild.roles.cache.find(role => role.name == therole );

//filtered by those with therole for the loop, fill members array with users ids with that role
const Members = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.id);

//now we have all the members in the arrary, let's go into a for loop to build the final arrary for output
for (var i=Members.length; i--;){
	
	//Find role ID for the role we are looking for (Europe in this example)
	//var thisrole = message.guild.roles.cache.find(role => role.name === 'Europe');
	
	//hardcode role ID for debug
	var thisrole = '797227088935518249'
	
	//true/false does the member have the role?
	//var haseurope = message.guild.members.cache.filter(member => Members[i]).has(thisrole);
	//var haseurope = message.guild.members.cache.find(member => Members[i]).has(thisrole);
	//var haseurope = message.member.roles.cache.some(r => r.name === 'Europe');
	var haseurope = message.guild.members.cache.find(id => Members[i]).some(r => r.name === 'Europe');	
	
	//Debug log
	console.log(i + 'The member is:' + Members[i]);		
	console.log(i + 'The role is:' + thisrole);
	console.log(i + 'Has Europe is:' + haseurope); 
	
	Members[i] = '\n' + Members[i];
	
	} 

//copy of origional for loop for backup
//for (var i=Members.length; i--;){Members[i] = '\n' + Members[i];} 

//Team-specific formatting

	// Change title and hilight color based on team
	var teamcolor;
	var teamtitle;
	
	if (therole == 'egg-streme') {
  	teamcolor = '0xb16dd0';
  	teamtitle = 'Team Egg-streme';
	} else if (therole == 'hard-boiled' ) {
  	teamcolor = '0x5c90e1';
  	teamtitle = 'Team Hard Boiled';
	} else if (therole == 'yolksters' ) {
  	teamcolor = '0xf0ba05';
  	teamtitle = 'Team Yolksters';
	} else {
  	teamcolor = '0x0099ff';
	teamtitle = 'Did not match a team';
	};

//Build our rich embed output
const teamoutput = {
	color: teamcolor,
	title: teamtitle,
	// Change this from a description to a field? Then can I add another field beside it with timezone?
	description: `${Members}`, 
	};

//Send our embeded message
message.channel.send({ embed: teamoutput });

//Put the role we popped back in stack at the bottom (so stack isnt emptied and we can run again)
teams.unshift(therole)
          
}; //end the for loop running for number of roles we have in array
}; //end !egg trigger block
}); //end 'on message'

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret
