const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
    console.log('I am ready!');
});

client.on("message", message => {

let myRole = message.guild.roles.cache.find(role => role.name === "Gambler");

    if(message.content == `!!go4-list`) {
        const ListEmbed = new Discord.RichEmbed()
            .setTitle('Users with the go4 role:')
            .setDescription(message.guild.roles.get('$myRole').members.map(m=>m.user.tag).join('\n'));
        message.channel.send(ListEmbed);                    
    }
});

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret