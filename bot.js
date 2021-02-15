const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {console.log('I am ready!');});

//===============================
//	team update bot		|
//===============================

//Define the things we are going to want to sort by
teams = ['egg-streme', 'yolksters','sunny-side','fowl-play','hard-boiled','over-easy'];
timezone = ['Europe', 'US WC', 'US EC', 'South America', 'Oceania'];
eggbonus = ['Medical Egger', 'Fusion Egger', 'Tachyon Egger', 'Antimatter Egger', 'Universe Egger', 'Enlightened Egger'];
permitstatus = ['Pro Permit', 'Standard Permit'];

//initiate some arrarys (so they will be global var)
var userroles = [];
var memberlist = [];
var memberdetails = [];

//arrays to build outputs into
var eggstremearr = [];
var yolkstersarr = [];
var sunnysidearr = [];
var fowlplayarr = [];
var hardboiledarr = [];
var overeasyarr = [];

//functions
//check functions: When looping through each member in update function, these functions look through the users roles (userroles) and return true for the role which matches.

	//check team function
	function checkteam(value) {
		for (var i = 0; i < userroles.length; i++) {
    		if (value.indexOf(userroles[i]) > -1) {
      		return true;
    		}//end for
		}//end if
  		return false;
		}//end function

	//check time function
	function checktime(value) {
		for (var i = 0; i < userroles.length; i++) {
    		if (value.indexOf(userroles[i]) > -1) {
      		return true;
    		}//end for
		}//end if
  		return false;
		}//end function

	//check egg function
	function checkbonus(value) {
		for (var i = 0; i < userroles.length; i++) {
    		if (value.indexOf(userroles[i]) > -1) {
      		return true;
    		}//end for
		}//end if
  		return false;
		}//end fucntion

	//check permit function
	function checkpermit(value) {
		for (var i = 0; i < userroles.length; i++) {
    		if (value.indexOf(userroles[i]) > -1) {
      		return true;
    		}//end for
		}//end if
  		return false;
		}//end function

	//member details are first stored in memberdetails, then stored in 2 dimension memberlist. Buildteam function adds the member objects from memberlist (containing member details) to a team specific array ready for processing to output.
	function buildteam(teamarray, teamfilter){
 		//clear array before start
		teamarray.splice(0,teamarray.length);
		for (var i = 0; i < memberlist.length; i++) {
  		if (memberlist[i][2] == teamfilter) {
  		teamarray.splice(i,0,memberlist[i]);
		}//end if
		}//end for
		}//end function

	function update(message){

		//we are going to need a counter incremented for each match below so that we can order things into the array
		var membuildcount = 0;
		var memlistcount = 0;

		//clear arrays on start
		memberdetails.splice(0,memberdetails.length);
		memberlist.splice(0,memberlist.length);

		//load up the members
		let members = message.guild.members.cache.array();

		//for every member on the server
		for(let member of members) {

			//start member details with display name. Splice it into the arrary at position membuildcount (0) counter then increment membuildcount so next object goes in next position. .
			memberdetails.splice(membuildcount,0, member.displayName);
			membuildcount = membuildcount + 1;

			//now lets get all thier roles into a string
			userroles = member.roles.cache.map(r => r.name);

			//Add timezone using checktime function.
			//fill timepick with objects from the timezone list which pass checktime as true (should just be one match). Splice it into the next location of memberdetails then increment build count.
			timepick = timezone.filter(checktime);
			if (timepick.length == 0)
			{memberdetails.splice(membuildcount,0, "No Timezone")}
			else {memberdetails.splice(membuildcount,0, String(timepick))}
			membuildcount = membuildcount + 1;

			//Add team with checkteam function (see timepick)
			teampick = teams.filter(checkteam);
			if (teampick.length == 0)
			{memberdetails.splice(membuildcount,0, "No Team");}
			else {memberdetails.splice(membuildcount,0, String(teampick));}
			membuildcount = membuildcount + 1;

			//Add egg bonus with checkbonus function (see timepick)
			bonuspick = eggbonus.filter(checkbonus);
			if (bonuspick.length == 0)
			{memberdetails.splice(membuildcount,0, "No Bonus");}
			else {memberdetails.splice(membuildcount,0, String(bonuspick));}
			membuildcount = membuildcount + 1;

			//Add permit status with checkpermit function (see timepick)
			permitpick = permitstatus.filter(checkpermit);
			if (permitpick.length == 0)
			{memberdetails.splice(membuildcount,0, "No Permit Status");}
			else {memberdetails.splice(membuildcount,0, String(permitpick));}
			membuildcount = membuildcount + 1;

			//now we have all user details in memberdetails [0] to [4], splice all that as one object into memberlist.
			memberlist.splice(memlistcount,0, memberdetails);
			memlistcount = membuildcount + 1;//increment memlistcount ready for next loop/user
			membuildcount = 0;//reset membuild count
			memberdetails = [];//this may not be needed. Try take it out?
		}//end for (let member of members) - every member on the server

		//build the team specific arrays
		buildteam(eggstremearr, "egg-streme");
		buildteam(yolkstersarr, "yolksters");
		buildteam(sunnysidearr, "sunny-side");
		buildteam(fowlplayarr, "fowl-play");
		buildteam(hardboiledarr, "hard-boiled");
		buildteam(overeasyarr, "over-easy");

	}//end update function

	//this function builds and returns the discord embed
	function prepupdate(color, title, description, array){
	const TeamEmbed = new Discord.MessageEmbed()
	.setColor(String(color))
	.setTitle(String(title))
	.setDescription(String(description));

	//loop to add the team members to the rich embed. Team specific array contains object for each member, so we loop through them to ad fields to the embed.
	for (var i = 0; i < array.length; i++) {
		TeamEmbed.addFields(
			{ name: array[i][0], value: 'Rank: ' + array[i][3] + '\n' + 'Time Zone: ' + array[i][1] + '\n' + 'Permit: ' + array[i][4], inline: true},
		);//end addfields
		}//end for
	return TeamEmbed;//return embed back to caller
	} //end fucntion
//end of functions

//==========================================

//look for messages, when one is sent do
client.on('message', async message => {

	//look for !update trigger. Allows manual update. Not needed with team outputs as update function is called first in those anyway.
	if (message.content.startsWith("!update")) {
		//updates all the arrays, passing message details to the function.
		update(message);
		message.channel.send("Teams updated");
		message.delete();
		} //end !update trigger block

	//look for !yolksters trigger
		if (message.content.startsWith("!yolksters")) {
		update(message);
		message.channel.send(prepupdate('#F0BA05' , 'Yolksters', 'Here are the team members in team Yolksters!', yolkstersarr));
		}//end !yolksters trigger block

	//look for !eggstreme trigger
		if (message.content.startsWith("!eggstreme")) {
		update(message);
		message.channel.send(prepupdate('#B16DD0' , 'Egg-streme', 'Here are the team members in team Egg-streme!', eggstremearr));
		}//end !eggstreme trigger block

	//look for !sunnyside trigger
		if (message.content.startsWith("!sunnyside")) {
		update(message);
		message.channel.send(prepupdate('#DFD370' , 'Sunny-side', 'Here are the team members in team Sunny-side!', sunnysidearr));
		}//end !sunnyside trigger block

	//look for !fowlplay trigger
		if (message.content.startsWith("!fowlplay")) {
		update(message);
		message.channel.send(prepupdate('#1865F5' , 'Fowl-play', 'Here are the team members in team Fowl-play!', fowlplayarr));
		}//end !fowlplay trigger block

	//look for !hardboiled trigger
		if (message.content.startsWith("!hardboiled")) {
		update(message);
		message.channel.send(prepupdate('#5C90E1' , 'Hard Boiled', 'Here are the team members in team Hard Boiled!', hardboiledarr));
		}//end !hardboiled trigger block

	//look for !overeasy trigger
		if (message.content.startsWith("!overeasy")) {
		update(message);
		message.channel.send(prepupdate('#A822BD' , 'Over Easy', 'Here are the team members in team Over Easy!', overeasyarr));
		}//end !overeasy trigger clock

}); //end 'on message'

//=======================================
//		Coop bot		|
//=======================================

//!coop - all commands start with coop
client.on('message', async message => {
	if (message.content.startsWith("!coop")){

		//first lets split up commands
		//transfer message contents into msg
		let msg = message.content;
		//make substring from first space onwards
		let argString = msg.substr(msg.indexOf(' ') + 1 );
		//split into multiple parts and store in array - might get errors if more then 3 parts?
		let argArr = argString.split(' ');
		//for each element in array, make into variable
		let [eggcommand1, eggcommand2, eggcommand3] = argArr;

		console.log('commmand 1 is: ' + eggcommand1);
		console.log('commmand 2 is: ' + eggcommand2);
		console.log('commmand 3 is: ' + eggcommand3);

//open a new coop
if (eggcommand1 == 'open' && String(eggcommand2) !== "undefined"){

	//unpin all messages
	message.channel.messages.fetchPinned().then(messages => {messages.forEach(message => { message.unpin()})});

	//build initial message and embed
	let embed = new Discord.MessageEmbed()
	  .setTitle(eggcommand2)
	  .setDescription('Please vote 👍 if you are farming this contract, 👎 if you are not or 🥚 if you would like to be a starter. Clicking 🗑 clears your choice.')
	  .addField('Status', 'Coop\'s not started.')
	  .setColor('#ffd700')

	//send initial message with embed and pin it
	message.channel.send(embed).then(async msg => {
		msg.pin();

	//add reactions for clicking
		await msg.react('👍');
		await msg.react('👎');
		await msg.react('🥚');
		await msg.react('🗑️');

	//establish update function. Recheck the votes array and ???
		async function update() {
			//create newEmbed from old embed
			const newEmbed = new Discord.MessageEmbed(embed);

			//set each votes equal to 0 then.....??????
			const userYes = (votes['👍'].size === 0)? '-' : [...votes['👍']];
			const userNo = (votes['👎'].size === 0)? '-' : [...votes['👎']];
			const userStarter = (votes['🥚'].size === 0)? '-' : [...votes['🥚']];

			//add votes values to embed fiels?
			newEmbed.addFields(
				{ name: `Farming (${votes['👍'].size})`, value: userYes, inline: true },
				{ name: `Not Farming (${votes['👎'].size})`, value: userNo, inline: true },
				{ name: `Starter (${votes['🥚'].size})`, value: userStarter, inline: true }
			);

			//edit message with newEmbed to update it
			await msg.edit(newEmbed);
		}

	//make votes unique???
		const votes = {
			'👍': new Set(),
			'👎': new Set(),
			'🥚': new Set(),
			'🗑️': new Set()
		};

		update();

	//define collector
		const collector = msg.createReactionCollector((reaction, user) => !user.bot , { dispose: true });

	//when a reaction is collected (clicked)
		collector.on('collect', async (reaction, user) => {

		//check it is one of the allowed reactions, else remove it
    if (['👍', '👎', '🥚', '🗑️'].includes(reaction.emoji.name)) {

		//filter the reactions on the message to those by the user who just clicked (which triggered this collect)
    const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));

		//check if it was the bin which was clicked, if so we need to loop through all reactions and remove any by the user
    for (const userReaction of userReactions.values()) {
      if (userReaction.emoji.name !== reaction.emoji.name || reaction.emoji.name === '🗑️') {
        userReaction.users.remove(user.id);
        votes[userReaction.emoji.name].delete(user);
        }
      }

			//if reaction was in the allowed 4, but not the bin, add user to votes arrary under that emoji
      votes[reaction.emoji.name].add(user);
    } else {
      reaction.remove();//was not an allowed reaction
    	}

		//before we leave this collect event, run update function
    update();
  	});//end collector.on 'collect'

	//when a user removes their own reaction
		collector.on('remove', (reaction, user) => {
		//delet the user from the votes array
		votes[reaction.emoji.name].delete(user);
		//run update function
		update();
		});

	});//end the .then from sending initial embed

//send another message to act as the holder for placed users
let placedEmbed = new Discord.MessageEmbed()
	.setTitle("Users placed in coop")
	.setDescription('Once users are placed, they will be shown here')
	.setColor('#ffd700')
	.setFooter('Bot created by LaniakeaSC');

message.channel.send(placedEmbed).then(async msg => {
	msg.pin();
})

};//end the if "open" block

//!coop placed @user
if (eggcommand1 == "placed" && String(eggcommand2) !== "undefined"){

//fetch pinned messages
message.channel.messages.fetchPinned().then(messages => {
	console.log(`Received ${messages.size} messages`);
	var testuserid = message.mentions.users.first().id;
	console.log(testuserid);

	//Iterate through the messages here with the variable "messages".
	messages.forEach(message => {
		console.log('message ID:' + message.id);
		console.log('eggcommand2:' + eggcommand2);

		//get user Id of who was @mentioned
		var thisuserid = eggcommand2.substring(
		eggcommand2.lastIndexOf("@") + 1,
		eggcommand2.lastIndexOf(">")
		);

		console.log('thisid: ' + thisuserid);
		console.log('message: ' + message.id);

		//make a second post/emmed for placed users...or edit the first embed with a new field. How about a second post/embed with fields for each team?

	})
});

};//end placed block
};//end if !coop block

}) ;//end client on message

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret
