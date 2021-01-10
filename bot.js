const Discord = require('discord.js');
const client = new Discord.Client();

//build team array
var teams = [ 'egg-streme', 'over-easy', 'sunny-side', 'hard-boiled', 'fowl-play', 'yolksters'];

client.on('ready', () => {
    console.log('I am ready!');
    console.log(teams)
});

//how long is teams
  //var numofroles = teams.length;
  //console.log(numofroles)

//start
client.on('message', async message => {


  //look for trigger
      if (message.content.startsWith("!egg")) {
       console.log('Seen an egg')
       
        //Set number of loops equal to number of roles
        var loops
        for (loops = 0;loops < numofroles; loops++){
        
       const therole = teams.pop();
       //what role did we pop?
         console.log(therole) 
         
       //debug counter. How many loops?
          //console.log('one loop')
        
       //find role for this loop
       const Role = message.guild.roles.cache.find(role => role.name == therole );
        //fill members array with users in that role
        const Members = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag);

       //basic output to channel (for troubleshooting)
         //message.channel.send(`1. Users with ${Role.name}: ${Members}`);
 
         //Duplicate Members into Members2 so we can mess with Members 2 preserving Members
           var Members2 = JSON.parse(JSON.stringify(Members)); 
          
          //append \n to each arrary string so discord takes new line
          for (var i=Members2.length; i--;) {Members2[i] = '\n' + Members2[i];} 
          
          //send message as output
          message.channel.send(`\n Users with ${Role.name}: ${Members2}`);
          
         //Put role back in stack at the bottom
          teams.unshift(therole)
          
     }; //end for loop
  }; //end !egg trigger block
}); //end 'on message'

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret