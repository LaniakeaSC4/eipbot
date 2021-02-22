const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => { console.log('I am ready!'); });

//=======================================
//		Coop bot		|
//=======================================

//define team/role arrarys outside command
var eggstremeMem = [];
var overeasyMem = [];
var yolkstersMem = [];
var sunnysideMem = [];
var fowlplayMem = [];
var hardboiledMem = [];

function validuser(message, user) {

	var validusers = [];

	var eggstremeMem = message.guild.roles.cache.get('717392493682884648').members.map(m => m.displayName);
	var overeasyMem = message.guild.roles.cache.get('717392318017175643').members.map(m => m.displayName);
	var yolkstersMem = message.guild.roles.cache.get('717391863287644251').members.map(m => m.displayName);
	var sunnysideMem = message.guild.roles.cache.get('717392245761900545').members.map(m => m.displayName);
	var fowlplayMem = message.guild.roles.cache.get('717392169861644339').members.map(m => m.displayName);
	var hardboiledMem = message.guild.roles.cache.get('717392100043390977').members.map(m => m.displayName);

	var validusers = validusers.concat(eggstremeMem, overeasyMem, yolkstersMem, sunnysideMem, fowlplayMem, hardboiledMem)

	if (validusers.includes(user)) { return true } else { return false }

}//end function validuser

function validteam(team) {
	if (teams.includes(team)) { return true } else { return false }
}//end function validteam

function changeusersquare(oldsq1, oldsq2, newsq, user) {

	var teams = [eggstremeMem, overeasyMem, yolkstersMem, sunnysideMem, fowlplayMem, hardboiledMem]
	//for loop to go through each team
	for (var i = 0; i < teams.length; i++) {
		for (var j = 0; j < teams[i].length; j++) {
			if (teams[i][j].includes(user)) {
				let str = teams[i][j]; let res = str.replace(oldsq1, newsq).replace(oldsq2, newsq); teams[i][j] = res;
			}
		}//end for this team loop
	}//end teams for loop
}//end of changeusersquare function

function changeteamsquare(oldsq1, oldsq2, newsq, team) {
	
	if (team == 'egg-streme') {
		for (var i = 0; i < eggstremeMem.length; i++) {
			let str = eggstremeMem[i]; let res = str.replace(oldsq1, newsq).replace(oldsq2, newsq); eggstremeMem[i] = res;
		}
	}//end if team Egg-streme

	if (team == 'over-easy') {
		for (var i = 0; i < overeasyMem.length; i++) {
			let str = overeasyMem[i]; let res = str.replace(oldsq1, newsq).replace(oldsq2, newsq); overeasyMem[i] = res;
		}
	}//end if team over-easy

	if (team == 'yolksters') {
		for (var i = 0; i < yolkstersMem.length; i++) {
			let str = yolkstersMem[i]; let res = str.replace(oldsq1, newsq).replace(oldsq2, newsq); yolkstersMem[i] = res;
		}
	}//end if team yolksters

	if (team == 'sunny-side') {
		for (var i = 0; i < sunnysideMem.length; i++) {
			let str = sunnysideMem[i]; let res = str.replace(oldsq1, newsq).replace(oldsq2, newsq); sunnysideMem[i] = res;
		}
	}//end if team sunny-side

	if (team == 'fowl-play') {
		for (var i = 0; i < fowlplayMem.length; i++) {
			let str = fowlplayMem[i]; let res = str.replace(oldsq1, newsq).replace(oldsq2, newsq); fowlplayMem[i] = res;
		}
	}//end if team fowl-play

	if (team == 'hard-boiled') {
		for (var i = 0; i < hardboiledMem.length; i++) {
			let str = hardboiledMem[i]; let res = str.replace(oldsq1, newsq).replace(oldsq2, newsq); hardboiledMem[i] = res;
		}
	}//end if team hard-boilee

}//end of changeteamsquare function

function updateplayerboard(message) {
	//fetch pinned messages
	message.channel.messages.fetchPinned().then(messages => {
		//for each pinned message
		messages.forEach(message => {
			let embed = message.embeds[0];

			if (embed != null && embed.footer.text.includes('LaniakeaSC')) { //find the right pinned message
				var receivedEmbed = message.embeds[0]; //copy embeds from it
				var updatedEmbed = new Discord.MessageEmbed(receivedEmbed); //make new embed for updating in this block with old as template

				//clear fields
				updatedEmbed.fields = [];

				//add the modified arrays back to fields
				updatedEmbed.addFields(
					{ name: `Team Eggstreme`, value: eggstremeMem, inline: true },
					{ name: `Team Over-easy`, value: overeasyMem, inline: true },
					{ name: `Team Yolksters`, value: yolkstersMem, inline: true },
					{ name: `Team Sunny-side`, value: sunnysideMem, inline: true },
					{ name: `Team Fowl-play`, value: fowlplayMem, inline: true },
					{ name: `Team Hard-boiled`, value: hardboiledMem, inline: true }
				);

				//send the updated embed
				message.edit(updatedEmbed);

			}//end if embed and footer text contains

		})//end message.forEach

	})//end .then after fetchPinned 

}//end function updateplayerboard

//!coop
client.on('message', async message => {
	if (message.content.startsWith("!coop")) {

		//first lets split up commands
		//transfer message contents into msg
		let msg = message.content;
		//make substring from first space onwards
		let argString = msg.substr(msg.indexOf(' ') + 1);
		//split into multiple parts and store in array - might get errors if more then 3 parts?
		let argArr = argString.split(' ');
		//for each element in array, make into variable
		let [eggcommand1, eggcommand2, eggcommand3] = argArr;

		console.log('commmand 1 is: ' + eggcommand1);
		console.log('commmand 2 is: ' + eggcommand2);
		console.log('commmand 3 is: ' + eggcommand3);

		//open a new coop
		if (eggcommand1 == 'open' && String(eggcommand2) !== "undefined") {

			//block 1 - coop voting block
			//unpin all messages
			message.channel.messages.fetchPinned().then(messages => { messages.forEach(message => { message.unpin() }) });

			//build initial message and embed
			let embed = new Discord.MessageEmbed()
				.setTitle('Reaction board for: ' + eggcommand2)
				.setDescription('Please click 👍 if you are farming this contract.\n\nPlease click 👎 if you are not.\n\nPlease click 🥚 if you would like to be a starter.\n\nClicking 🗑 clears your choice.')
				.setColor('#ffd700')
				.setFooter('⬇️ Please add a reaction below ⬇️')

			//send initial message with embed and pin it
			message.channel.send(embed).then(async msg => {
				msg.pin();

				//add reactions for clicking
				await msg.react('👍');
				await msg.react('👎');
				await msg.react('🥚');
				await msg.react('🗑️');

				//establish updatevotes function. Recheck the votes array and ???
				async function updatevotes() {
					//create newEmbed from old embed
					const newEmbed = new Discord.MessageEmbed(embed);

					//set each votes equal to 0 then.....??????
					const userYes = (votes['👍'].size === 0) ? '-' : [...votes['👍']];
					const userNo = (votes['👎'].size === 0) ? '-' : [...votes['👎']];
					const userStarter = (votes['🥚'].size === 0) ? '-' : [...votes['🥚']];

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

				updatevotes();

				//define collector
				const collector = msg.createReactionCollector((reaction, user) => !user.bot, { dispose: true });

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
					updatevotes();
				});//end collector.on 'collect'

				//when a user removes their own reaction
				collector.on('remove', (reaction, user) => {
					//delet the user from the votes array
					votes[reaction.emoji.name].delete(user);
					//run update function
					updatevotes();
				});

			});//end the .then from sending initial embed
			//end of block 1

			//Block 2 - Who has been placed in coop

			//build initial team arrays.
			eggstremeMem = message.guild.roles.cache.get('717392493682884648').members.map(m => m.displayName);
			overeasyMem = message.guild.roles.cache.get('717392318017175643').members.map(m => m.displayName);
			yolkstersMem = message.guild.roles.cache.get('717391863287644251').members.map(m => m.displayName);
			sunnysideMem = message.guild.roles.cache.get('717392245761900545').members.map(m => m.displayName);
			fowlplayMem = message.guild.roles.cache.get('717392169861644339').members.map(m => m.displayName);
			hardboiledMem = message.guild.roles.cache.get('717392100043390977').members.map(m => m.displayName);

			//add red squares
			for (var i = 0; i < eggstremeMem.length; i++) { eggstremeMem[i] = "🟥 " + eggstremeMem[i]; }
			for (var i = 0; i < overeasyMem.length; i++) { overeasyMem[i] = "🟥 " + overeasyMem[i]; }
			for (var i = 0; i < yolkstersMem.length; i++) { yolkstersMem[i] = "🟥 " + yolkstersMem[i]; }
			for (var i = 0; i < sunnysideMem.length; i++) { sunnysideMem[i] = "🟥 " + sunnysideMem[i]; }
			for (var i = 0; i < fowlplayMem.length; i++) { fowlplayMem[i] = "🟥 " + fowlplayMem[i]; }
			for (var i = 0; i < hardboiledMem.length; i++) { hardboiledMem[i] = "🟥 " + hardboiledMem[i]; }

			let placedEmbed = new Discord.MessageEmbed()
				.setTitle("Player status board")
				.setDescription('🟥 - Not yet offered coop\n\n🟧 - Offered coop\n\n🟩 - In coop')
				.setColor('#00FF00')
				.setFooter('Bot created by LaniakeaSC')
				.addFields(
					{ name: `Team Eggstreme`, value: eggstremeMem, inline: true },
					{ name: `Team Over-easy`, value: overeasyMem, inline: true },
					{ name: `Team Yolksters`, value: yolkstersMem, inline: true },
					{ name: `Team Sunny-side`, value: sunnysideMem, inline: true },
					{ name: `Team Fowl-play`, value: fowlplayMem, inline: true },
					{ name: `Team Hard-boiled`, value: hardboiledMem, inline: true }
				);

			message.channel.send(placedEmbed).then(async msg => {
				msg.pin();
			})//end pin placed user embed
			//end of block 2

		};//end the if !open
		message.delete();//delete input command
	};//end if !coop block

	//!red 🟥
	if (message.content.startsWith("!red")) {

		var isuser = false;
		var isteam = false;

		//what user or team was mentioned?
		if (message.mentions.users.size !== 0) {
			var mentioneduser = message.mentions.users.first().displayName; isuser = true;
		} else if (message.mentions.roles.size !== 0) {
			var mentionedrole = message.mentions.roles.first().name; isteam = true;
		} else { console.log('did not find either'); }

		console.log('Mentioneduser :' + mentioneduser);

		if (isuser == true && validuser(message, mentioneduser) == true) {

			changeusersquare("🟩", "🟧", "🟥", mentioneduser);
			updateplayerboard(message);

		}//end if isuser = true

		if (isteam == true && validteam(mentionedrole) == true) {

			changeteamsquare("🟩", "🟧", "🟥", mentionedrole);
			updateplayerboard(message);

		}//end if isteam = true

	}//end !red

	//!orange 🟧
	if (message.content.startsWith("!orange")) {

		var isuser = false;
		var isteam = false;

		//what user or team was mentioned?
		if (message.mentions.users.size !== 0) {
			var mentioneduser = message.mentions.users.first().displayName; isuser = true;
		} else if (message.mentions.roles.size !== 0) {
			var mentionedrole = message.mentions.roles.first().name; isteam = true;
		} else { console.log('did not find either'); }

		if (isuser == true && validuser(message, mentioneduser) == true) {

			changeusersquare("🟩", "🟥", "🟧", mentioneduser);
			updateplayerboard(message);

		}//end if isuser = true

		if (isteam == true && validteam(mentionedrole) == true) {

			changeteamsquare("🟩", "🟥", "🟧", mentionedrole);
			updateplayerboard(message);

		}//end if isteam = true

	}//end !orange

	//!green 🟩
	if (message.content.startsWith("!green")) {

		var isuser = false;
		var isteam = false;

		//what user or team was mentioned?
		if (message.mentions.users.size !== 0) {
			var mentioneduser = message.mentions.users.first().displayName; isuser = true;
		} else if (message.mentions.roles.size !== 0) {
			var mentionedrole = message.mentions.roles.first().name; isteam = true;
		} else { console.log('did not find either'); }

		if (isuser == true && validuser(message, mentioneduser) == true) {

			changeusersquare("🟧", "🟥", "🟩", mentioneduser);
			updateplayerboard(message);

		}//end if isuser = true

		if (isteam == true && validteam(mentionedrole) == true) {

			changeteamsquare("🟧", "🟥", "🟩", mentionedrole);
			updateplayerboard(message);

		}//end if isteam = true

	}//end !green

});//end client on message

//delete all bot pin notifications
client.on("message", (message) => { if (message.type === "PINS_ADD" && message.author.bot) message.delete(); })

//===============================
//	team update bot		|
//===============================

//initiate some variables for global use
//Define the things we are going to want to sort by
teams = ['egg-streme', 'yolksters', 'sunny-side', 'fowl-play', 'hard-boiled', 'over-easy'];
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
function update(message) {

	//we are going to need a counter incremented for each match below so that we can order things into the array
	var membuildcount = 0;
	var memlistcount = 0;

	//clear arrays on start
	memberdetails.splice(0, memberdetails.length);
	memberlist.splice(0, memberlist.length);

	//load up the members
	let members = message.guild.members.cache.array();

	//for every member on the server
	for (let member of members) {

		//start member details with display name. Splice it into the arrary at position membuildcount (0) counter then increment membuildcount so next object goes in next position. .
		memberdetails.splice(membuildcount, 0, member.displayName);
		membuildcount = membuildcount + 1;

		//now lets get all thier roles into a string
		userroles = member.roles.cache.map(r => r.name);

		//Add timezone using checktime function.
		//fill timepick with objects from the timezone list which pass checktime as true (should just be one match). Splice it into the next location of memberdetails then increment build count.
		timepick = timezone.filter(checktime);
		if (timepick.length == 0) { memberdetails.splice(membuildcount, 0, "No Timezone") }
		else { memberdetails.splice(membuildcount, 0, String(timepick)) }
		membuildcount = membuildcount + 1;

		//Add team with checkteam function (see timepick)
		teampick = teams.filter(checkteam);
		if (teampick.length == 0) { memberdetails.splice(membuildcount, 0, "No Team"); }
		else { memberdetails.splice(membuildcount, 0, String(teampick)); }
		membuildcount = membuildcount + 1;

		//Add egg bonus with checkbonus function (see timepick)
		bonuspick = eggbonus.filter(checkbonus);
		if (bonuspick.length == 0) { memberdetails.splice(membuildcount, 0, "No Bonus"); }
		else { memberdetails.splice(membuildcount, 0, String(bonuspick)); }
		membuildcount = membuildcount + 1;

		//Add permit status with checkpermit function (see timepick)
		permitpick = permitstatus.filter(checkpermit);
		if (permitpick.length == 0) { memberdetails.splice(membuildcount, 0, "No Permit Status"); }
		else { memberdetails.splice(membuildcount, 0, String(permitpick)); }
		membuildcount = membuildcount + 1;

		//now we have all user details in memberdetails [0] to [4], splice all that as one object into memberlist.
		memberlist.splice(memlistcount, 0, memberdetails);
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

//functions to build outputs
//member details are first stored in memberdetails, then stored in 2 dimension memberlist. Buildteam function adds the member objects from memberlist (containing member details) to a team specific array ready for processing to output.
function buildteam(teamarray, teamfilter) {
	teamarray.splice(0, teamarray.length);	//clear array before start
	for (var i = 0; i < memberlist.length; i++) {
		if (memberlist[i][2] == teamfilter) {
			teamarray.splice(i, 0, memberlist[i]);
		}//end if
	}//end for
}//end function

//this function builds and returns the discord embed
function prepupdate(color, title, description, array) {
	const TeamEmbed = new Discord.MessageEmbed()
		.setColor(String(color))
		.setTitle(String(title))
		.setDescription(String(description));

	//loop to add the team members to the rich embed. Team specific array contains object for each member, so we loop through them to ad fields to the embed.
	for (var i = 0; i < array.length; i++) {
		TeamEmbed.addFields(
			{ name: array[i][0], value: 'Rank: ' + array[i][3] + '\n' + 'Time Zone: ' + array[i][1] + '\n' + 'Permit: ' + array[i][4], inline: true },
		);//end addfields
	}//end for
	return TeamEmbed;//return embed back to caller
} //end fucntion
//end of functions

//here we actually output our team lists
client.on('message', async message => {

	//look for !yolksters trigger
	if (message.content.startsWith("!yolksters")) {
		update(message);
		message.channel.send(prepupdate('#F0BA05', 'Yolksters', 'Here are the team members in team Yolksters!', yolkstersarr));
	}//end !yolksters trigger block

	//look for !eggstreme trigger
	if (message.content.startsWith("!eggstreme")) {
		update(message);
		message.channel.send(prepupdate('#B16DD0', 'Egg-streme', 'Here are the team members in team Egg-streme!', eggstremearr));
	}//end !eggstreme trigger block

	//look for !sunnyside trigger
	if (message.content.startsWith("!sunnyside")) {
		update(message);
		message.channel.send(prepupdate('#DFD370', 'Sunny-side', 'Here are the team members in team Sunny-side!', sunnysidearr));
	}//end !sunnyside trigger block

	//look for !fowlplay trigger
	if (message.content.startsWith("!fowlplay")) {
		update(message);
		message.channel.send(prepupdate('#1865F5', 'Fowl-play', 'Here are the team members in team Fowl-play!', fowlplayarr));
	}//end !fowlplay trigger block

	//look for !hardboiled trigger
	if (message.content.startsWith("!hardboiled")) {
		update(message);
		message.channel.send(prepupdate('#5C90E1', 'Hard Boiled', 'Here are the team members in team Hard Boiled!', hardboiledarr));
	}//end !hardboiled trigger block

	//look for !overeasy trigger
	if (message.content.startsWith("!overeasy")) {
		update(message);
		message.channel.send(prepupdate('#A822BD', 'Over Easy', 'Here are the team members in team Over Easy!', overeasyarr));
	}//end !overeasy trigger clock

}); //end 'on message' for outputing team lists

// THIS  MUST  BE  THIS  WAY

client.login(process.env.BOT_TOKEN);

//BOT_TOKEN is the Client Secret
