const Discord = require('discord.js');
const client = new Discord.Client();

//build team array
var teams = [ 'egg-streme', 'over-easy'];

client.on('ready', () => {
    console.log('I am ready!');
    console.log(teams)
});

//how long is teams
var numofroles = teams.length;
console.log(numofroles)

//for each teams array in teams
//for (const property in teams) {



//start
client.on('message', async message => {
  
  //pop the role stack

  //look for trigger
    if (message.content.startsWith("!egg")) {
      
      
      var loops 
      for (loops = 0;i < numofroles; loops++){
      
      const therole = teams.pop();
console.log(therole) 

//debug counter
console.log('one loop')

      
      
      //find role
      const Role = message.guild.roles.cache.find(role => role.name == therole );
      //fill members array with users in that role
      const Members = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag);

        //basic output to channel (for troubleshooting)
        //message.channel.send(`1. Users with ${Role.name}: ${Members}`);
 
        //Duplicate Members into Members2 so we can mess with Members 2 preserving Members
        var Members2 = JSON.parse(JSON.stringify(Members)); 
        //append \n to each arrary string so discord takes new line
        for (var i=Members2.length; i--;) {Members2[i] = '\n' + Members2[i];} 
        
        //send message as output - broke Here? 
        message.channel.send(`Users with ${Role.name}:\n ${Members2}`);
        
        teams.unshift(therole)
        
    };
};

//end forEach
});

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret