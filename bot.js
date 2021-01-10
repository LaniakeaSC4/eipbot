const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
    console.log('I am ready!');
});



client.on('message', async message => {
    if (message.content.startsWith("!egg")) {
        const Role = message.guild.roles.cache.find(role => role.name == "egg-streme");
        const Members = message.guild.members.cache.filter(member => member.roles.cache.find(role => role == Role)).map(member => member.user.tag);
        message.channel.send(`1. Users with ${Role.name}: ${Members}`);
        
var Members2 = JSON.parse(JSON.stringify(Members)); 

Members2 = Members2.map(i => '#' + i); 
        
        message.channel.send(`2. Users with ${Role.name}: ${Members2}`);
        
    };
});

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret