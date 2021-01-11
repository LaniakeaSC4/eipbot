const Discord = require('discord.js');
const client = new Discord.Client();

//build team array
var teams = [ 'egg-streme', 'over-easy', 'sunny-side', 'hard-boiled', 'fowl-play', 'yolksters'];

client.on('ready', () => {
    console.log('I am ready!');
    //console.log(teams)
});
//start
client.on('message', async message => {
  //look for trigger
      if (message.content.startsWith("!egg")) {
       console.log('Seen an egg')
       
       //how many roles to loop?
       var numofroles = teams.length
       
        //Set number of loops equal to number of roles
        var loops
        for (loops = 0;loops < numofroles; loops++){
        
          const therole = teams.pop();
          //what role did we pop?
           //console.log(therole) 
           
         //find role for this loop
         const Role = message.guild.roles.cache.find(role => role.name == therole );
		
         //fill members array with users in that role
          const Members = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag);
           
         //append \n to each arrary string so discord takes new line
         for (var i=Members.length; i--;) {Members[i] = '\n' + Members[i];} 
            
         //Simple - send message as output
         //message.channel.send(`Users with ${Role.name}: ${Members}`);
          
         //Build our rich embed output
             const teamoutput = {
		color: 0x0099ff,
		title: therole,
		url: 'https://discord.js.org',
		author: {
			name: 'Some name',
			icon_url: 'https://i.imgur.com/wSTFkRM.png',
			url: 'https://discord.js.org',
			},
		description: 'Some description here',
		thumbnail: {
			url: 'https://i.imgur.com/wSTFkRM.png',
			},
		fields: [
			{
				name: 'Regular field title',
				value: 'Some value here',
			},
			{
				name: '\u200b',
				value: '\u200b',
				inline: false,
			},
			{
				name: 'Inline field title',
				value: 'Some value here',
				inline: true,
			},
			{
				name: 'Inline field title',
				value: 'Some value here',
				inline: true,
			},
			{
				name: 'Inline field title',
				value: 'Some value here',
				inline: true,
			},
		],
		image: {
			url: 'https://i.imgur.com/wSTFkRM.png',
		},
		timestamp: new Date(),
		footer: {
			text: 'Some footer text here',
			icon_url: 'https://i.imgur.com/wSTFkRM.png',
		},
	};

message.channel.send({ embed: teamoutput });
            
          
         //Put role back in stack at the bottom
          teams.unshift(therole)
          
     }; //end for loop
  }; //end !egg trigger block
}); //end 'on message'

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret
