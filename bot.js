const Discord = require('discord.js');
const client = new Discord.Client();

//build team array
var teams = [ 'egg-streme' ];

client.on('ready', () => {
	//Are we alive?
	console.log('I am ready!');
	//Debug - Output the teams array to console
	//console.log(teams)
});

//start
client.on('message', async message => {

//look for !egg trigger
if (message.content.startsWith("!egg")) {
	//Debug - Log that an !egg command was seen
	//console.log('Seen an egg')
       
//Set number of loops equal to number of roles
var roleloops
for (roleloops = 0;roleloops < teams.length; roleloops++){

//pop a role to work with for this loop
const therole = teams.pop();
	//Debug - what role did we pop?
        //console.log(therole) 

//find role for this loop
//const Role = message.guild.roles.cache.find(role => role.name == therole );

const Role = message.guild.roles.cache.find(role => role.name == therole );

//fill members array with users in that role
//const Members = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.username);
const Members = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.id);

//console.log(Members)

	for (var i=Members.length; i--;){
	
//Find role
    var thisrole = message.guild.roles.cache.find(role => role.name === 'Europe');
    //pop member
    let member = Members[i];

var haseurope = message.member.roles.cache.has(thisrole);

//from web
console.log(thisrole)
console.log(haseurope); 

Members[i] = '\n' + Members[i];

} 

//format members array

	//add n to arrary
//	for (var i=Members.length; i--;)
	
//	{Members[i] = '\n' + Members[i];
	
//	} 

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
