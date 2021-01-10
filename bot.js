const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
    console.log('I am ready!');
});

client.on("message", message => {

    if(message.content.startsWith(`${prefix}go4-add`)) {
        message.mentions.members.first().addRole('415665311828803584'); // gets the <GuildMember> from a mention and then adds the role to that member                     
    }

    if(message.content == `!!go4-list`) {
        const ListEmbed = new Discord.RichEmbed()
            .setTitle('Users with the go4 role:')
            .setDescription(message.guild.roles.get('415665311828803584').members.map(m=>m.user.tag).join('\n'));
        message.channel.send(ListEmbed);                    
    }
});

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret