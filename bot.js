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
              //message.channel.send(`\n Users with ${Role.name}: ${Members}`);
          
             //rich embed
             const teamoutput = new Discord.MessageEmbed()
            .setColor('#0099ff')
            console.log(role.name)
            .setTitle('${role.name}')
             
             //need to pop members here? Working here
             
             
             .setDescription('Members.pop();');
          
          message.channel.send(teamoutput);
          
         //Put role back in stack at the bottom
          teams.unshift(therole)
          
     }; //end for loop
  }; //end !egg trigger block
}); //end 'on message'

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret