const Discord = require('discord.js');
const client = new Discord.Client();

//build team array
var teams = [ 'egg-streme', 'hard-boiled', 'yolksters'];

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
const Role = message.guild.roles.cache.find(role => role.name == therole );
	
//fill members array with users in that role
const Members = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.username);

//format members array
	//append \n to each arrary string so discord takes new line
	for (var i=Members.length; i--;) {Members[i] = '\n' + Members[i];} 

//Get ready for team-specific formatting
if (therole = 'egg-streme') {
  thiscolor = '0x0099ff'
  thistitle = 'Members of team Egg-streme'
} else if (therole = 'hard-boiled' ) {
  thiscolor = '0x0099ff'
  thistitle = 'Members of team Egg-streme'
} else if (therole = 'yolksters' ) {
  thiscolor = '0x0099ff'
  thistitle = 'Members of team Egg-streme' 
} else {
  thiscolor = '0x0099ff'
  thistitle = 'Did not match a team' 
};

console.log(thistitle)

//Build our rich embed output
const teamoutput = {
	color: 0x0099ff,
	title: therole,
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
