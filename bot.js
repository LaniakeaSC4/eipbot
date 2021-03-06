const Discord = require('discord.js');
const client = new Discord.Client();
client.on('ready', () => {
	console.log('I am ready!');
	var statuschannel = client.channels.cache.find(channel => channel.name === "bot-status");
	client.channels.cache.get(statuschannel.id)
		.send(`!EIP Bot reporting for duty (I have been restarted... But I am back!)`);
});

client.on('message', async message => {
	if (message.content.startsWith("!EIP Bot reporting for duty")) {
		//buildteamobj(message);
		message.channel.send('It is great to be back! Please tell our master that the team members object has been rebuilt. We are ready for action!');

	}
});//end client on message

// ---- Info ----
// home team should be under category including word "home"
// channel names under "home" category should contact a match for the role (e.g. "Home Teams" category should contain a channel "team egg-streme" and the "egg-streme" part should match a server role for the team)
// this is what we will use to establish the teams that there are
// ---- ---- ----

//=======================================
//	Coop bot | Functions
//=======================================

//!test command for testing things
client.on('message', async message => {
	if (message.content.startsWith("!test")) {

		restartcollector(message)

	}
});//end client on message

//!build command for testing things
client.on('message', async message => {
	if (message.content.startsWith("!build")) {

		buildteamobj(message);

	}
});//end client on message

//!rebuild command for testing things
client.on('message', async message => {
	if (message.content.startsWith("!rebuild")) {

		rebuildteamobj(message)

	}
});//end client on message

//=======================================
// Coop bot | Functions | Initalise
//=======================================

//define global storage objects
var teams = {};
var teammembers = {};

//function to build team object from home team channels
function buildteamobj(message) {

	//get array of all server roles
	var roles = message.guild.roles.cache.map((role) => role.name);

	//get discord category channels (e.g 🏠 Home Teams)
	const categoryChannels = client.channels.cache.filter(channel => channel.type === "category");

	//blank array which will hold the channel names of the child channels under the home team category
	var homechannels = [];

	//push name of each child channel in "🏠 Home Teams" into array
	categoryChannels.forEach(channel => {
		var LCchan = channel.name.toLowerCase()
		if (LCchan.includes('home') == true) {
			channel.children.forEach((channel) => {

				//push the child channels under the home category into array
				homechannels.push(channel.name);

			})//end forEach child channel
		}//end if channel name includes home
	});//end categoryChannels.forEach

	//define teams array, team names will be stored here for use by other functions
	var teamnames = [];

	//for each channel under the home team category, check all server roles to see if there is a string match (e.g. role is mentioned in channel name)
	for (var i = 0; i < homechannels.length; i++) {
		for (var j = 0; j < roles.length; j++) {
			//if a channel has a role/team match
			if (homechannels[i].includes(roles[j])) {

				//first lets save the team name itself for use by other functions
				teamnames.push(roles[j])

				//clean the role of any special characters (remove hyphenation) for keying team member storage in the teams object.
				var cleanrole = roles[j].replace(/[^a-zA-Z ]/g, "");

				//find the role in the sever cache which matches the channel-matched role (we will need it's ID)
				let role = message.guild.roles.cache.find(r => r.name === roles[j]);

				//search by role ID to get all members with that role
				var thesemembers = message.guild.roles.cache.get(role.id).members.map(m => m.displayName);

				//store members in the team members object, keyed by cleaned team name
				teammembers[cleanrole] = thesemembers;

			}//end if match
		}//end for roles
	}//end for homechannels

	//add red squares
	for (let key in teammembers) {
		for (var i = 0; i < teammembers[key].length; i++) {
			teammembers[key][i] = "🟥 " + teammembers[key][i];
		}
	}

	//store the teams (roles) in the object
	teams['teams'] = teamnames;
}//end function

//=======================================
// Coop bot | Functions | rebuild
//=======================================

//function rebuild team arrays
function rebuildteamobj(message) {
	return new Promise((resolve, reject) => {
		console.log('entered rebuildteamobj function')
		//clear object for rebuilding it
		teammembers = {};

		//define teams array, team names will be stored here for use by other functions
		var teamnames = [];

		//get the status board		//fetch pinned messages
		message.channel.messages.fetchPinned().then(messages => {
			//for each pinned message 
			messages.forEach(message => {

				//embed[0] is first/only embed in message. Copy it to embed variable
				let embed = message.embeds[0];

				if (embed != null && embed.footer.text.includes('LaniakeaSC')) { //find the right pinned message
					console.log('found message with footer in rebuild obj function');
					for (var i = 0; i < embed.fields.length; i++) {//for each of the fields (teams) in the embed

						//get the values (team members). Is loaded as string with \n after each player
						var thesemembers = embed.fields[i].value

						//split into array. thesemembers is now array of team members with thier current status square
						thesemembers = thesemembers.split('\n');

						//the title of each fiels is set to "Team " followed by the team name (e.g "egg-streme"). Split at ' ' and pop to get just team (role) name
						var thisteam = embed.fields[i].name.split(' ').pop()

						//save the team (role) name itself for use by other functions
						teamnames.push(thisteam)

						//clean the role of any special characters (remove hyphenation) for keying team member storage in the teams object.
						var cleanrole = thisteam.replace(/[^a-zA-Z ]/g, "");

						//store members in the team members object, keyed by cleaned team name
						teammembers[cleanrole] = thesemembers;
					}//end for loop
					resolve(true);
				}//end if embed and footer text contains
			})//end message.forEach
		})//end .then after fetchPinned

		//store the teams (roles) in the object
		teams['teams'] = teamnames;

	})//end promise
}//end function rebuildteamobj 

//function to loop through all of the team arrarys looking for the user and change thier square colour
function changeusersquare(oldsq1, oldsq2, newsq, user) {
	return new Promise((resolve, reject) => {
		console.log('entered changerusersquare function')
		for (var i = 0; i < teams.teams.length; i++) {//for each of the teams (roles)

			var cleanrole = teams.teams[i].replace(/[^a-zA-Z ]/g, "");//teammebers object is keyed with a cleaned version of role (no hyphen) 

			//loop through teammembers object looking for the user displayname which was provided. If found, replace oldsq1 or oldsq2 with newsq and save back into object
			for (var j = 0; j < teammembers[cleanrole].length; j++) {
				if (teammembers[cleanrole][j].includes(user)) {
					let str = teammembers[cleanrole][j]; let res = str.replace(oldsq1, newsq).replace(oldsq2, newsq); teammembers[cleanrole][j] = res;
				} //end replace square core function
			}//end for this team loop
		}//end teams for loop
		resolve(true);
	})//end promise
}//end of changeusersquare function

//function to change whole team's squares at once
function changeteamsquare(oldsq1, oldsq2, newsq, team) {
	return new Promise((resolve, reject) => {

		var cleanrole = team.replace(/[^a-zA-Z ]/g, "");//teammebers object is keyed with a cleaned version of role (no hyphen) 

		//access teammembers object at cleaned teamname provided. If found, replace oldsq1 or oldsq2 with newsq and save back into object
		for (var i = 0; i < teammembers[cleanrole].length; i++) {
			let str = teammembers[cleanrole][i]; let res = str.replace(oldsq1, newsq).replace(oldsq2, newsq); teammembers[cleanrole][i] = res;
		}//end for loop
		resolve(true);
	})//end promise
}//end of changeteamsquare function

//function to republish the player status board from current state of arrays
function updateplayerboard(message) {
	return new Promise((resolve, reject) => {
		console.log('entered updateplayerboard function')
		//fetch pinned messages
		message.channel.messages.fetchPinned().then(messages => {
			//for each pinned message
			messages.forEach(message => {

				//embed[0] is first/only embed in message. Copy it to embed variable
				let embed = message.embeds[0];

				if (embed != null && embed.footer.text.includes('LaniakeaSC')) { //find the right pinned message

					var receivedEmbed = message.embeds[0]; //copy embeds from it
					var updatedEmbed = new Discord.MessageEmbed(receivedEmbed); //make new embed for updating in this block with old as template

					//clear fields
					updatedEmbed.fields = [];

					//add teams and players for embed from teams/teammeber objects
					for (var i = 0; i < teams.teams.length; i++) {

						var cleanrole = teams.teams[i].replace(/[^a-zA-Z ]/g, "");//teammebers object is keyed with a cleaned version of role (no hyphen)
						updatedEmbed.addField(`Team ${teams.teams[i]}`, teammembers[cleanrole], true)

					}

					//send the updated embed
					message.edit(updatedEmbed);
					resolve(true);
				}//end if embed and footer text contains

			})//end message.forEach

		})//end .then after fetchPinned 
	})//end promise
}//end function updateplayerboard

//async function to chain rebuild functions to follow each other - for single user
async function updateplayersquare(oldsq1, oldsq2, newsq, user, message) {

	try {
		await rebuildteamobj(message)
		await changeusersquare(oldsq1, oldsq2, newsq, user)
		await updateplayerboard(message)
	} catch (err) {
		console.log(err)
	}

}//end function

//async function to chain rebuild functions to follow each other - for team
async function updateteamsquare(oldsq1, oldsq2, newsq, team, message) {

	try {
		await rebuildteamobj(message)
		await changeteamsquare(oldsq1, oldsq2, newsq, team)
		await updateplayerboard(message)
	} catch (err) {
		console.log(err)
	}

}//end function

//=======================================
// Coop bot | Functions | other
//=======================================

//check if the user is on one of the home teams
function validuser(message, user) {

	var validusers = [];//blank the validusers array

	//fill validusers with all the members. vars declared local to this function
	var eggstremeMem = message.guild.roles.cache.get('717392493682884648').members.map(m => m.displayName);
	var overeasyMem = message.guild.roles.cache.get('717392318017175643').members.map(m => m.displayName);
	var yolkstersMem = message.guild.roles.cache.get('717391863287644251').members.map(m => m.displayName);
	var sunnysideMem = message.guild.roles.cache.get('717392245761900545').members.map(m => m.displayName);
	var fowlplayMem = message.guild.roles.cache.get('717392169861644339').members.map(m => m.displayName);
	var hardboiledMem = message.guild.roles.cache.get('717392100043390977').members.map(m => m.displayName);

	//combine all
	var validusers = validusers.concat(eggstremeMem, overeasyMem, yolkstersMem, sunnysideMem, fowlplayMem, hardboiledMem);

	//if user passed to function is in that array, return true, else false
	if (validusers.includes(user)) { return true } else { return false }

}//end function validuser

//check if the role mentioned is one of the valid home teams
function validteam(team) {
	//this uses teams arrary establised for the team card bot
	if (teams.includes(team)) { return true } else { return false }
}//end function validteam

//function to get displayname for those that have changed thiers. Returns regular username if they dont have a nickname
function getname(message) {

	if (message.mentions.users.size !== 0) {//first check if there were indeed any mentioned users

		var userid = message.mentions.users.first().id;//get the ID of the first mention

		//check if they have a nickname set
		const member = message.guild.member(userid);//retrieve the user from ID
		var dName = member.nickname;//set dName (displayName) to the member object's nickname

		//if they dont have a nickname, thier username is what is displayed by discord.
		var uName = message.mentions.users.first().username;

		//if both dname and uName are not null, we must have found a nickame. Therefore return it, or instead return the username
		if (dName !== null && uName !== null) {
			return dName
		} else { return uName };

	}//end if mentions size !== 0

}//end getname function

//function to delete color change input command and reply with a thank you/wait message
function thankyou(author, updatedthis, color, message) {
	message.channel.send('Thank you ' + author + ' for updating ' + updatedthis + ' to ' + color + '. Statusboard will update in ~5 seconds. Please wait.')
	message.delete()//delete the input message
}//end thankyou function

//restart collector function for startup - not yet developed
//search all channels. find all posts that need collectors and restart them?
function restartcollector(message) {
var collectorstate = {}
	//find all posts (in all channels?)
	message.channel.messages.fetchPinned().then(messages => {
		//for each pinned message
		messages.forEach(msg => {

			//embed[0] is first/only embed in message. Copy it to embed variable
			let embed = msg.embeds[0];

			if (embed != null && embed.footer.text.includes('⬇️ Please add a reaction below ⬇️')) { //find the right pinned message
				console.log('found the pinned message')


				//rebuild set from current post
for (var i = 0; i < embed.fields.length; i++) {//for each of the fields (farming/not farming/starter) in the embed

						//get the values (reacted users). Is loaded as string with \n after each player
						var thesemembers = embed.fields[i].value
console.log(thesemembers)
						//split into array. thesemembers is now array of team members with thier team members ids
						thesemembers = thesemembers.split('\n');

for (var j = 0;j < thesemembers.length;j++){
  
  
  thesemembers[j] = thesemembers[j].substring(
    thesemembers[j].lastIndexOf("@") + 1, 
    thesemembers[j].lastIndexOf(">")
);
}
console.log(thesemembers)
						//the title of each fiels is set to "Team " followed by the team name (e.g "egg-streme"). Split at ' ' and pop to get just team (role) name
						var thisteam = embed.fields[i].name;
console.log(thisteam);
cleanteam = thisteam.substring(0,thisteam.lastIndexOf("(")-1).replace(/[^a-zA-Z ]/ig, ""); 
    console.log(cleanteam)

						//store members in the team members object, keyed by cleaned team name
						collectorstate[cleanteam] = thesemembers;
					}//end for embed fields loop
			
console.log(collectorstate)
			}//end if embed and footer text contains

		})//end message.forEach

	})//end .then after fetchPinned 

}

//=======================================
//		Coop bot	|	User Commands
//=======================================

//!coop (including !coop open [name])
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

			//Block 2 - Who has been placed in coop

			//initialise teams object (becasue this is the !coop open command)
			buildteamobj(message);

			let placedEmbed = new Discord.MessageEmbed()
				.setTitle("Player status board")
				.setDescription('🟥 - Not yet offered coop\n\n🟧 - Offered coop\n\n🟩 - In coop')
				.setColor('#00FF00')
				.setFooter('Bot created by LaniakeaSC')

			//add teams and players for embed from teams/teammeber objects
			for (var i = 0; i < teams.teams.length; i++) {

				var cleanrole = teams.teams[i].replace(/[^a-zA-Z ]/g, "");//teammebers object is keyed with a cleaned version of role (no hyphen)
				placedEmbed.addField(`Team ${teams.teams[i]}`, teammembers[cleanrole], true)

			}

			message.channel.send(placedEmbed).then(async msg => {
				msg.pin();
			})//end pin placed user embed
			//end of block 2

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
					console.log(votes)
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

		};//end the if !open

		message.delete();//delete input command

	};//end if !coop block

});//end client on message

//square colour change commands (!red, !orange, !green)
client.on('message', async message => {
	//!red 🟥
	if (message.content.startsWith("!red")) {

		//initalise isuser and isteam as false
		var isuser = false;
		var isteam = false;

		//what user or team was mentioned?
		if (message.mentions.users.size !== 0) {
			var mentioneduser = getname(message); isuser = true;
		} else if (message.mentions.roles.size !== 0) {
			var mentionedrole = message.mentions.roles.first().name; isteam = true;
		} else { console.log('did not find either'); }

		//if mention is a valid user
		if (isuser == true && validuser(message, mentioneduser) == true) {

			updateplayersquare("🟩", "🟧", "🟥", mentioneduser, message);
			thankyou(message.member.displayName, mentioneduser, "red", message);

		}//end if isuser = true

		//if mentioned is a valid team
		if (isteam == true && validteam(mentionedrole) == true) {

			updateteamsquare("🟩", "🟧", "🟥", mentionedrole, message);
			thankyou(message.member.displayName, mentionedrole, "red", message);

		}//end if isteam = true

	}//end !red

	//!orange 🟧
	if (message.content.startsWith("!orange")) {

		//initalise isuser and isteam as false
		var isuser = false;
		var isteam = false;

		//what user or team was mentioned?
		if (message.mentions.users.size !== 0) {
			var mentioneduser = getname(message); isuser = true;
		} else if (message.mentions.roles.size !== 0) {
			var mentionedrole = message.mentions.roles.first().name; isteam = true;
		} else { console.log('did not find either'); }

		//if mention is a valid user
		if (isuser == true && validuser(message, mentioneduser) == true) {

			updateplayersquare("🟩", "🟥", "🟧", mentioneduser, message);
			thankyou(message.member.displayName, mentioneduser, "orange", message);

		}//end if isuser = true

		//if mentioned is a valid team
		if (isteam == true && validteam(mentionedrole) == true) {

			updateteamsquare("🟩", "🟥", "🟧", mentionedrole, message);
			thankyou(message.member.displayName, mentionedrole, "orange", message);

		}//end if isteam = true

	}//end !orange

	//!green 🟩
	if (message.content.startsWith("!green")) {

		//initalise isuser and isteam as false
		var isuser = false;
		var isteam = false;

		//what user or team was mentioned?
		if (message.mentions.users.size !== 0) {
			var mentioneduser = getname(message); isuser = true;
		} else if (message.mentions.roles.size !== 0) {
			var mentionedrole = message.mentions.roles.first().name; isteam = true;
		} else { console.log('did not find either'); }

		//if mention is a valid user
		if (isuser == true && validuser(message, mentioneduser) == true) {

			updateplayersquare("🟧", "🟥", "🟩", mentioneduser, message);
			thankyou(message.member.displayName, mentioneduser, "green", message);

		}//end if isuser = true

		//if mentioned is a valid team
		if (isteam == true && validteam(mentionedrole) == true) {

			updateteamsquare("🟧", "🟥", "🟩", mentionedrole, message);
			thankyou(message.member.displayName, mentionedrole, "green", message);

		}//end if isteam = true

	}//end !green

});//end client on message

//delete all bot pin notifications (this is for all bot pins, accross the whole server)
client.on("message", (message) => { if (message.type === "PINS_ADD" && message.author.bot) message.delete(); })

//=======================================
//		team card bot	|	Functions
//=======================================

//initiate some variables for global use
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

//update function - main function to update team cards
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

//=======================================
//		team card bot	|	Commands
//=======================================

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

//=======================================
//		Discord Client Login
//=======================================

client.login(process.env.BOT_TOKEN);
