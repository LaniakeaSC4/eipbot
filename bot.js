const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
    console.log('I am ready!');
});

client.on("message", message => {

    if(message.content == `!!go4-list`) {
      
      
      let roleID = "797014592780894209";
let membersWithRole = message.guild.roles.get('roleID').members;
console.log(`Got ${membersWithRole.size} members with that role.`);


//let myRole = message.guild.roles.cache.get("797014592780894209");
      
        const ListEmbed = new Discord.RichEmbed()
            .setTitle('Users with the go4 role:')
            .setDescription(message.guild.roles.get('$myRole').members.map(m=>m.user.tag).join('\n'));
        message.channel.send(ListEmbed);                    
    }
});

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret