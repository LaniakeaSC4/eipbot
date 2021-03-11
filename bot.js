const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

// ---- Info ----
// home team should be under category including word "home"
// channel names under "home" category should contact a match for the role (e.g. "Home Teams" category should contain a channel "team egg-streme" and the "egg-streme" part should match a server role for the team)
// this is what we will use to establish the teams that there are
// ---- ---- ----

//!test command for testing things
client.on('message', async message => {
	if (message.content.startsWith("!test")) {
		console.log(statusboardmessages)
	}
});//end client on message 

//=======================================
// Coop bot | Functions | Initalise
//=======================================

client.on('ready', () => {
	//build arrary of open status boards
	arraystatusboards()
	console.log('I am ready!');
});

//define global storage objects
var teams = {};//this one is for just the teams/roles that match the home team channels
var teammembers = {};//the main data storage for the status board. Team titles and team members with squares and farming status

//function to build team object from home team channels. This object contains the teams and team members. 🟥's added during initalisation
function buildteamobj(message) {
	//not sure if this will ever trigger. Here as a safety net. If this goes off, we might have problems. 
	if (message.partial) { console.log("Partial message!!!!") }
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
			teammembers[key][i] = "🟥 (💤) " + teammembers[key][i];
		}//end for each team member
	}//end for each team

	//store the teams (roles) in the object
	teams['teams'] = teamnames;
}//end function

//======================================================
//	Coop bot | Functions | Reaction Status (👍👎🥚💤)
//  1. Message reaction add listener
//  2. Refresh array of currently open coops
//  3. Emoji swapper function
//======================================================

// 1. reaction add listener
client.on('messageReactionAdd', async (reaction, user) => {
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
			console.log('a partial reaction was fetched')
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}//end catch
	}//end if reaction.partial

	//when reaction is added, check the ID of the message it was added to. If it matches one of the open status boards then...
	for (var i = 0; i < statusboardmessages.length; i++) {
		if (statusboardmessages[i].includes(reaction.message.id)) {
			//I will need a message object. need to get the channel and message ID from reaction, then fetch it to be used by these functions below.
			var thischannel = reaction.message.channel.id
			var thismessage = reaction.message.id

			//get displayname from userid. Need this for the string match in the status board/teammembers object
			//check if they have a nickname set
			const member = await client.users.fetch(user.id)//retrieve the user from ID
			var dName = member.nickname;//set dName (displayName) to the member object's nickname
			//if they dont have a nickname, thier username is what is displayed by discord.
			var uName = member.username

			var thisuser = ""
			//if both dname and uName are not null, we must have found a nickname (this user has both). Therefore return nickname, or instead set thisuser to the username
			if (dName !== undefined && uName !== undefined) {
				thisuser = dName
			} else { thisuser = uName }

			//if user is not the bot, log whats going to happen
			if (thisuser != "EiP Bot") { console.log(thisuser + "reacted with " + reaction.emoji.name + " on status board message: " + reaction.message.id) }

			//we are only going further into the function with one of these 4 emoji
			var allowedemoji = ['👍', '👎', '🥚', '💤']
			if (thisuser != "EiP Bot" && allowedemoji.includes(reaction.emoji.name)) {
				//get the message object for the status board which recieved the reaction, then...
				await client.channels.cache.get(thischannel).messages.fetch(thismessage).then(async msg => {
					try {
						reaction.message.reactions.removeAll()//remove all reactions to prevent extra input
						await rebuildteamobj(msg)//rebuild the teammembers object for *this* status board
						await changeplayerstatus(reaction.emoji.name, thisuser)//update the user in the teammembers object with the new emojj
						await updateplayerboard(msg)//now the teammembers object is updated, republish the status board
						//add the reactions back in ready for the next person
						await msg.react('👍');
						await msg.react('👎');
						await msg.react('🥚');
						await msg.react('💤');
						//lastly, trigger a rebuild of the statusboards array (not needed for this function, but keeps us up to date)
						arraystatusboards()
					} catch (err) {
						console.log(err)
					}//end catch error
				})//end .then after fetching statusboard
			}//end if EIP Bot and allowed reaction
		}//end if reaction message is a statusboard message
	}//end for loop checking through stored reaction board message ids for a match for this reaction add
});//end client on reaction add 

//global var array to we can find status board messages later and/or filter the reactionAdd event to these message IDs. Rebuilt on startup and when any reaction is added to a status board message
var statusboardmessages = [];

// 2. function to rebuild statusboardmessages with open coop status boards
function arraystatusboards() {
	//clear array before rebuild
	statusboardmessages = []
	//get all text channels
	const categoryChannels = client.channels.cache.filter(channel => channel.type === "text" && channel.deleted == false);
	categoryChannels.forEach(channel => {//for each non-deleted test channel

		channel.messages.fetchPinned().then(messages => {//fetch pinned messsages
			messages.forEach(msg => {//for each pinned message
				//embed[0] is first/only embed in message. Copy it to embed variable
				let embed = msg.embeds[0]
				//find the right pinned message
				if (embed != undefined && embed.footer.text.includes('LaniakeaSC') && !embed.footer.text.includes('This coop is closed')) {
					console.log('found a pinned statusboard message with ID: ' + msg.id)
					statusboardmessages.push(msg.id);//push this message ID into the statusboardmessages array if it is not closed
				}//end if embed and footer text contains
			})//end message.forEach
		})//end .then after fetchPinned
			.catch((err) => { });
	});//end categoryChannels.forEach

}//end array statusboards function 

// 3. function to swap any of the 4 emoji for the clicked one (swaps in bot memory, need to update status board)
function changeplayerstatus(newemoji, user) {
	//log the change we are making
	console.log('user: ' + user + 'just changed thier status to: ' + newemoji)
	return new Promise((resolve, reject) => {
		var oldemoji = ['👍', '👎', '🥚', '💤']//these are the possible emoji that we will be replacing
		//loop through all teams/users for the memeber we are looking for, then update thier emoji in the teammembers object
		for (var i = 0; i < teams.teams.length; i++) {//for each of the teams (roles)
			var cleanrole = teams.teams[i].replace(/[^a-zA-Z ]/g, "");//teammebers object is keyed with a cleaned version of role (no hyphen) 
			//loop through teammembers object looking for the user displayname which was provided. If found, replace emoji and save back into object
			for (var j = 0; j < teammembers[cleanrole].length; j++) {
				if (teammembers[cleanrole][j].includes(user)) {
					let str = teammembers[cleanrole][j];
					let res = str.replace(oldemoji[0], newemoji).replace(oldemoji[1], newemoji).replace(oldemoji[2], newemoji).replace(oldemoji[3], newemoji);
					teammembers[cleanrole][j] = res;
				} //end replace emoji core function
			}//end for this team loop
		}//end teams for loop
		resolve(true);
	})//end promise
}//end of changeplayerstatus function

//========================================================
// Coop bot | Functions | Coop status (🟥🟧🟩)
// 1. Find and return promise of statusboard 
// 2. Rebuild from current status board (scrape)
// 3. modify the object in memory (for team or individual)
// 4. edit/update message on discord
// 5. Async functions to chain steps 1-4 together
//========================================================

// 1. Returns promise of statusboard message object in the channel the command was sent
function findstatusboard(message) {
	return new Promise((resolve, reject) => {
		//get the status board		//fetch pinned messages
		message.channel.messages.fetchPinned().then(messages => {
			//for each pinned message 
			messages.forEach(msg => {
				//embed[0] is first/only embed in message. Copy it to embed variable
				let embed = msg.embeds[0];
				//find the right pinned message
				if (embed != undefined && embed.footer.text.includes('LaniakeaSC')) {
					console.log('found a pinned statusboard message with ID: ' + msg.id)
					resolve(msg)
				}//end if embed and footer text contains
			})//end message.forEach
		})//end .then after fetchPinned
	})//end promise
}//end function findstatusboard

// 2. Function to rebuild teammembers object by finding it in the channel the command was sent
function rebuildteamobj(message) {
	return new Promise((resolve, reject) => {
		console.log('entered rebuildteamobj function')
		//clear object for rebuilding it
		teammembers = {};
		//define teams array, team names will be stored here for use by other functions
		var teamnames = [];
		//fetch pinned messages from this channel then...
		message.channel.messages.fetchPinned().then(messages => {
			//for each pinned message 
			messages.forEach(message => {
				//embed[0] is first/only embed in message. Copy it to embed variable
				let embed = message.embeds[0];
				//find the right pinned message
				if (embed != null && embed.footer.text.includes('LaniakeaSC')) {
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

// 3a. function to loop through all of the team arrarys looking for the user and change thier square colour
function changeusersquare(oldsq1, oldsq2, newsq, user) {
	return new Promise((resolve, reject) => {
		for (var i = 0; i < teams.teams.length; i++) {//for each of the teams (roles)
			//teammebers object is keyed with a cleaned version of role (no hyphen) 
			var cleanrole = teams.teams[i].replace(/[^a-zA-Z ]/g, "")
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

// 3b. function to change whole team's squares at once
function changeteamsquare(oldsq1, oldsq2, newsq, team) {
	return new Promise((resolve, reject) => {
		//teammebers object is keyed with a cleaned version of role (no hyphen)
		var cleanrole = team.replace(/[^a-zA-Z ]/g, "")
		//access teammembers object at cleaned teamname provided. If found, replace oldsq1 or oldsq2 with newsq and save back into object
		for (var i = 0; i < teammembers[cleanrole].length; i++) {
			let str = teammembers[cleanrole][i]; let res = str.replace(oldsq1, newsq).replace(oldsq2, newsq); teammembers[cleanrole][i] = res;
		}//end for loop
		resolve(true);
	})//end promise
}//end of changeteamsquare function

// 4. function to republish the player status board from current state of arrays
function updateplayerboard(message) {
	return new Promise((resolve, reject) => {
		console.log('entered updateplayerboard function')
		//fetch pinned messages
		message.channel.messages.fetchPinned().then(messages => {
			//for each pinned message
			messages.forEach(message => {
				//embed[0] is first/only embed in message. Copy it to embed variable
				let embed = message.embeds[0];
				//find the right pinned message
				if (embed != null && embed.footer.text.includes('LaniakeaSC')) {
					var receivedEmbed = message.embeds[0]; //copy embeds from it
					var updatedEmbed = new Discord.MessageEmbed(receivedEmbed) //make new embed for updating in this block with old as template
					updatedEmbed.fields = []//clear fields
					//add teams and players for embed from teams/teammeber objects
					for (var i = 0; i < teams.teams.length; i++) {
						var cleanrole = teams.teams[i].replace(/[^a-zA-Z ]/g, "");//teammebers object is keyed with a cleaned version of role (no hyphen)
						updatedEmbed.addField(`Team ${teams.teams[i]}`, teammembers[cleanrole], true)
					}//end loop through teams updating from memory teammembers object

					//send the updated embed
					message.edit(updatedEmbed);
					resolve(true);
				}//end if embed and footer text contains
			})//end message.forEach
		})//end .then after fetchPinned 
	})//end promise
}//end function updateplayerboard

// 5a. async function to chain rebuild functions to follow each other - for single user
async function updateplayersquare(oldsq1, oldsq2, newsq, user, message) {
	try {
		await rebuildteamobj(message)//rebuild memory object from message passed to function
		await changeusersquare(oldsq1, oldsq2, newsq, user)//change squares in the memory object
		await updateplayerboard(message)//update player board from memory object
	} catch (err) { console.log(err) }
}//end function

// 5b. async function to chain rebuild functions to follow each other - for team
async function updateteamsquare(oldsq1, oldsq2, newsq, team, message) {
	try {
		await rebuildteamobj(message)//rebuild memory object from message passed to function
		await changeteamsquare(oldsq1, oldsq2, newsq, team)//change squares in the memory object
		await updateplayerboard(message)//update player board from memory object
	} catch (err) { console.log(err) }
}//end function

//=======================================
// Coop bot | Functions | other
// 1. Check if user is valid
//=======================================

// 1. check if the user is on one of the home teams
async function checkifvaliduser(message, user) {
	//rebuild team object so we can search through valid users
	await rebuildteamobj(message)
	var teammembervalues = Object.values(teammembers)//get all the values from the object
	var merged = [].concat.apply([], teammembervalues)//merge all values into 1 dimensional array
	var found = merged.find(element => element.includes(user))//search merged array for user passed to function. If there, return user, else undefined
	//if user passed to function is in that array, return true, else false
	if (typeof found !== 'undefined') { return true } else { return false }
}//end function validuser

//check if the role mentioned is one of the valid home teams
async function checkifvalidteam(message,team) {
	await rebuildteamobj(message)
	var validteams = Object.values(teams)
	var merged = [].concat.apply([], validteams)//merge all values into 1 dimensional array
	var found = merged.find(element => element.includes(team))//search merged array for user passed to function. If there, r
	console.log(found)
	//this uses teams arrary establised for the team card bot
	if (typeof found !== 'undefined') { return true } else { return false }
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

			//unpin all messages - update to unpin only the specific messages
			message.channel.messages.fetchPinned().then(messages => { messages.forEach(message => { message.unpin() }) });

			//===============================
			// block 1 - Status board block
			//===============================

			//initialise teams object (becasue this is the !coop open command)
			buildteamobj(message);

			let placedEmbed = new Discord.MessageEmbed()
				.setTitle("EiP Status Board for contract: " + eggcommand2)
				.setDescription('**Bot Functions**\n__Player Status__\nPlease add a reaction below to tell us if you are farming this contract.\n👍 if you are farming\n👎 if you are not farming\n🥚 if you would like to be a starter\n💤 to reset your choice\nThe bot will take about 8 seconds to update your status then the next person can react.\n\n__Coop Status__\nThe squares below represent the status of the coop\n🟥 - Player not yet offered coop (set this with !red @user or !red @team)\n🟧 - Player offered coop (set this with !orange @user or !orange @team)\n🟩 - Player is confirmed in coop (set this with !green @user or !green @team)\n\n__Admin Commands__\nTo open a new coop use: !coop open [coop name]\nTo close the active coop in this channel use: !coop close\n')
				.setColor('#00FF00')
				.setFooter('Bot created by LaniakeaSC\n⬇️ Please add a reaction below ⬇️')

			//add teams and players for embed from teams/teammeber objects
			for (var i = 0; i < teams.teams.length; i++) {

				var cleanrole = teams.teams[i].replace(/[^a-zA-Z ]/g, "");//teammebers object is keyed with a cleaned version of role (no hyphen)
				placedEmbed.addField(`Team ${teams.teams[i]}`, teammembers[cleanrole], true)

			}

			message.channel.send(placedEmbed).then(async msg => {

				//push the message ID into global var array to we can find these messages later and/or filter the reactionAdd event to these message IDs. Rebuild this array by big search on startup?
				statusboardmessages.push(msg.id);
				console.log("Coop opened. Current Status Boards are: " + statusboardmessages)

				await msg.pin();
				//add reactions for clicking
				await msg.react('👍');
				await msg.react('👎');
				await msg.react('🥚');
				await msg.react('💤');

			})//end pin placed user embed
			//end of block 1

			//===============================
			// block 2 - Reaction board block
			//===============================

			// //build initial message and embed
			// let embed = new Discord.MessageEmbed()
			// 	.setTitle('Reaction board for: ' + eggcommand2)
			// 	.setDescription('Please click 👍 if you are farming this contract.\n\nPlease click 👎 if you are not.\n\nPlease click 🥚 if you would like to be a starter.\n\nClicking 🗑 clears your choice.')
			// 	.setColor('#ffd700')
			// 	.setFooter('⬇️ Please add a reaction below ⬇️')

			// //send initial message with embed and pin it
			// message.channel.send(embed).then(async msg => {
			// 	msg.pin();

			// 	//add reactions for clicking
			// 	await msg.react('👍');
			// 	await msg.react('👎');
			// 	await msg.react('🥚');
			// 	await msg.react('🗑️');

			// 	//establish updatevotes function. Recheck the votes array and ???
			// 	async function updatevotes() {
			// 		//create newEmbed from old embed
			// 		const newEmbed = new Discord.MessageEmbed(embed);

			// 		//set each votes equal to 0 then.....??????
			// 		const userYes = (newvotes['👍'].size === 0) ? 'None' : [...newvotes['👍']];
			// 		const userNo = (newvotes['👎'].size === 0) ? 'None' : [...newvotes['👎']];
			// 		const userStarter = (newvotes['🥚'].size === 0) ? 'None' : [...newvotes['🥚']];

			// 		//add votes values to embed fiels?
			// 		newEmbed.addFields(
			// 			{ name: `Farming (${newvotes['👍'].size})`, value: userYes, inline: true },
			// 			{ name: `Not Farming (${newvotes['👎'].size})`, value: userNo, inline: true },
			// 			{ name: `Starter (${newvotes['🥚'].size})`, value: userStarter, inline: true }
			// 		);

			// 		//edit message with newEmbed to update it
			// 		await msg.edit(newEmbed);

			// 	}

			// 	updatevotes();

			// 	//define collector
			// 	const collector = msg.createReactionCollector((reaction, user) => !user.bot, { dispose: true });

			// 	//when a reaction is collected (clicked)
			// 	collector.on('collect', async (reaction, user) => {

			// 		//check it is one of the allowed reactions, else remove it
			// 		if (['👍', '👎', '🥚', '🗑️'].includes(reaction.emoji.name)) {

			// 			//filter the reactions on the message to those by the user who just clicked (which triggered this collect)
			// 			const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));

			// 			//check if it was the bin which was clicked, if so we need to loop through all reactions and remove any by the user
			// 			for (const userReaction of userReactions.values()) {
			// 				if (userReaction.emoji.name !== reaction.emoji.name || reaction.emoji.name === '🗑️') {
			// 					userReaction.users.remove(user.id);
			// 					newvotes[userReaction.emoji.name].delete(user);
			// 				}
			// 			}

			// 			//if reaction was in the allowed 4, but not the bin, add user to votes arrary under that emoji
			// 			newvotes[reaction.emoji.name].add(user);
			// 		} else {
			// 			reaction.remove();//was not an allowed reaction
			// 		}

			// 		//before we leave this collect event, run update function
			// 		updatevotes();
			// 	});//end collector.on 'collect'

			// 	//when a user removes their own reaction
			// 	collector.on('remove', (reaction, user) => {
			// 		//delet the user from the votes array
			// 		newvotes[reaction.emoji.name].delete(user);
			// 		//run update function
			// 		updatevotes();
			// 	});

			// });//end the .then from sending initial embed
			//end of block 2

		};//end the if !open

		//open a new coop
		if (eggcommand1 == 'close') {


			await findstatusboard(message).then((statusboard) => {
				console.log('Closing statusboard: ' + statusboard)
				statusboard.reactions.removeAll()
				var receivedEmbed = statusboard.embeds[0] //copy embeds from it
				var updatedEmbed = new Discord.MessageEmbed(receivedEmbed) //make new embed for updating in this block with old as template
				updatedEmbed.setFooter('Bot created by LaniakeaSC\nThis coop is closed')
				updatedEmbed.setColor('#FF0000')
				statusboard.edit(updatedEmbed)
				statusboard.unpin()
				arraystatusboards()
			})

		};//end the if !close

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

		var checkeduser = await checkifvaliduser(message, mentioneduser)
		var checkedteam = await checkifvalidteam(message, mentioneduser)

		//if mention is a valid user
		if (isuser == true && checkeduser == true) {

			updateplayersquare("🟩", "🟧", "🟥", mentioneduser, message);
			thankyou(message.member.displayName, mentioneduser, "red", message);

		}//end if isuser = true

		//if mentioned is a valid team
		if (isteam == true && checkedteam == true) {

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

		var checkeduser = await checkifvaliduser(message, mentioneduser)
		var checkedteam = await checkifvalidteam(message, mentioneduser)

		//if mention is a valid user
		if (isuser == true && checkeduser == true) {

			updateplayersquare("🟩", "🟥", "🟧", mentioneduser, message);
			thankyou(message.member.displayName, mentioneduser, "orange", message);

		}//end if isuser = true

		//if mentioned is a valid team
		if (isteam == true && checkedteam == true) {

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

		var checkeduser = await checkifvaliduser(message, mentioneduser)
		var checkedteam = await checkifvalidteam(message, mentioneduser)

		//if mention is a valid user
		if (isuser == true && checkeduser == true) {

			updateplayersquare("🟧", "🟥", "🟩", mentioneduser, message);
			thankyou(message.member.displayName, mentioneduser, "green", message);

		}//end if isuser = true

		//if mentioned is a valid team
		if (isteam == true && checkedteam == true) {

			updateteamsquare("🟧", "🟥", "🟩", mentionedrole, message);
			thankyou(message.member.displayName, mentionedrole, "green", message);

		}//end if isteam = true

	}//end !green

});//end client on message

//delete all bot pin notifications (this is for all bot pins, accross the whole server)
//client.on("message", (message) => { if (message.type === "PINS_ADD" && message.author.bot) message.delete(); })

//=========================================
// Coop bot	| Functions | restart collector
//=========================================

//define newvotes sets - THIS IS USED BY NORMAL COLLECTOR (not just restart function)
// const newvotes = {
// 	'👍': new Set(),
// 	'👎': new Set(),
// 	'🥚': new Set(),
// 	'🗑️': new Set()
// };

//used to store current user reactions
//var collectorstate = {}

// //restart collector function
// function rebuildcollectorstate(message) {
// 	return new Promise((resolve, reject) => {
// 		collectorstate = {}

// 		//fetch pinned message in channel from passed message
// 		message.channel.messages.fetchPinned().then(messages => {

// 			//for each pinned message
// 			messages.forEach(msg => {

// 				//remove all reactions
// 				//msg.reactions.removeAll();

// 				//embed[0] is first/only embed in message. Copy it to embed variable
// 				let embed = msg.embeds[0];

// 				if (embed != null && embed.footer.text.includes('⬇️ Please add a reaction below ⬇️')) { //find the pinned message with the reaction board
// 					console.log('found the pinned message')

// 					//rebuild set from current post
// 					for (var i = 0; i < embed.fields.length; i++) {//for each of the fields (farming/not farming/starter) in the embed

// 						//get the values (reacted users). Is loaded as string with \n after each player
// 						var thesemembers = embed.fields[i].value

// 						//split into array. thesemembers is now array of team members with thier team members ids
// 						thesemembers = thesemembers.split('\n');

// 						var cleanmembers = []
// 						for (var j = 0; j < thesemembers.length; j++) {//loop through array and pull out the userID

// 							if (thesemembers[j] != "None") {
// 								cleanmembers.push(thesemembers[j].substring(thesemembers[j].lastIndexOf("@") + 1, thesemembers[j].lastIndexOf(">")))
// 							}
// 						}

// 						//the title of each fields is set to farming/not farming/starter
// 						var thisteam = embed.fields[i].name;

// 						//clean the title. Remove the count, lowercase, remove hyphens. This will key the object.
// 						cleanteam = thisteam.substring(0, thisteam.lastIndexOf("(") - 1).replace(/[^A-Z0-9]/ig, "").toLowerCase();

// 						//store current collector state. Keyed by field title
// 						collectorstate[cleanteam] = cleanmembers;
// 					}//end for embed fields loop

// 					//add farmers to newvotes
// 					if (collectorstate.farming.length != 0) {
// 						for (var f = 0; f < collectorstate.farming.length; f++) {
// 							console.log('found 1 thumbs up')
// 							console.log(collectorstate.farming[f])
// 							client.users.fetch(collectorstate.farming[f]).then(user => { newvotes['👍'].add(user); })
// 						}
// 					}

// 					//add not-farmers to newvotes
// 					if (collectorstate.notfarming.length != 0) {
// 						for (var n = 0; n < collectorstate.notfarming.length; n++) {
// 							console.log('found 1 thumbs down')
// 							console.log(collectorstate.notfarming[n])
// 							client.users.fetch(collectorstate.notfarming[n]).then(user => { newvotes['👎'].add(user); })
// 						}
// 					}

// 					//add starters to newvotes
// 					if (collectorstate.starter.length != 0) {
// 						for (var s = 0; s < collectorstate.notfarming.length; s++) {
// 							console.log('found 1 starter')
// 							console.log(collectorstate.notfarming[s])
// 							client.users.fetch(collectorstate.notfarming[s]).then(user => { newvotes['🥚'].add(user); })
// 						}
// 					}

// 					console.log(newvotes)

// 				}//end if embed and footer text contains

// 			})//end message.forEach

// 		})//end .then after fetchPinned
// 		resolve();
// 	})//end promise
//}

// function clearboard(message) {
// 	return new Promise((resolve, reject) => {
// 		message.channel.messages.fetchPinned().then(messages => {

// 			//for each pinned message
// 			messages.forEach(msg => {
// 				let embed = msg.embeds[0];

// 				if (embed != null && embed.footer.text.includes('⬇️ Please add a reaction below ⬇️')) {
// 					const newEmbed = new Discord.MessageEmbed(embed);

// 					//clear fields
// 					newEmbed.fields = [];

// 					//add votes values to embed fiels?
// 					newEmbed.addFields(
// 						{ name: `Farming (0)`, value: 'None', inline: true },
// 						{ name: `Not Farming (0)`, value: 'None', inline: true },
// 						{ name: `Starter (0)`, value: 'None', inline: true }
// 					);

// 					//edit message with newEmbed to update it
// 					msg.edit(newEmbed);

// 				}
// 				resolve()
// 			})
// 		})
// 	})//end promise
// }

// function restartvotes(message) {
// 	return new Promise((resolve, reject) => {
// 		//borrow functions from the initial setup
// 		//fetch pinned message in channel from passed message
// 		message.channel.messages.fetchPinned().then(messages => {

// 			//for each pinned message
// 			messages.forEach(msg => {

// 				//embed[0] is first/only embed in message. Copy it to embed variable
// 				let embed = msg.embeds[0];

// 				if (embed != null && embed.footer.text.includes('⬇️ Please add a reaction below ⬇️')) { //find the pinned message with the reaction board
// 					console.log('found the pinned message')

// 					//  msg.react('👍');
// 					//	msg.react('👎');
// 					//	msg.react('🥚');
// 					//	msg.react('🗑️');

// 					//establish updatevotes function. Recheck the votes array and ???
// 					async function updatevotes() {

// 						await clearvotes()

// 						//create newEmbed from old embed
// 						const newEmbed = new Discord.MessageEmbed(embed);

// 						//set each votes equal to 0 then.....??????
// 						const userYes = (newvotes['👍'].size === 0) ? 'None' : [...newvotes['👍']];
// 						const userNo = (newvotes['👎'].size === 0) ? 'None' : [...newvotes['👎']];
// 						const userStarter = (newvotes['🥚'].size === 0) ? 'None' : [...newvotes['🥚']];

// 						//clear fields
// 						newEmbed.fields = [];

// 						//add votes values to embed fiels?
// 						newEmbed.addFields(
// 							{ name: `Farming (${newvotes['👍'].size})`, value: userYes, inline: true },
// 							{ name: `Not Farming (${newvotes['👎'].size})`, value: userNo, inline: true },
// 							{ name: `Starter (${newvotes['🥚'].size})`, value: userStarter, inline: true }
// 						);

// 						//edit message with newEmbed to update it
// 						await msg.edit(newEmbed);
// 						//console.log(newvotes);
// 					}

// 					async function clearvotes() {

// 						//create newEmbed from old embed
// 						const newEmbed = new Discord.MessageEmbed(embed);

// 						newEmbed.fields = [];

// 						newEmbed.addFields(
// 							{ name: `Farming (0)`, value: 'None', inline: true },
// 							{ name: `Not Farming (0)`, value: 'None', inline: true },
// 							{ name: `Starter (0)`, value: 'None', inline: true }
// 						);

// 						//edit message with newEmbed to update it
// 						await msg.edit(newEmbed);
// 					}


// 					updatevotes();

// 					//define collector
// 					const collector = msg.createReactionCollector((reaction, user) => !user.bot, { dispose: true });

// 					//when a reaction is collected (clicked)
// 					collector.on('collect', async (reaction, user) => {

// 						//check it is one of the allowed reactions, else remove it
// 						if (['👍', '👎', '🥚', '🗑️'].includes(reaction.emoji.name)) {

// 							//filter the reactions on the message to those by the user who just clicked (which triggered this collect)
// 							const userReactions = msg.reactions.cache.filter(reaction => reaction.users.cache.has(user.id));

// 							//check if it was the bin which was clicked, if so we need to loop through all reactions and remove any by the user
// 							for (const userReaction of userReactions.values()) {
// 								if (userReaction.emoji.name !== reaction.emoji.name || reaction.emoji.name === '🗑️') {
// 									userReaction.users.remove(user.id);
// 									newvotes[userReaction.emoji.name].delete(user);
// 								}
// 							}

// 							//if reaction was in the allowed 4, but not the bin, add user to votes arrary under that emoji
// 							newvotes[reaction.emoji.name].add(user);
// 						} else {
// 							reaction.remove();//was not an allowed reaction
// 						}

// 						//before we leave this collect event, run update function
// 						updatevotes();
// 					});//end collector.on 'collect'

// 					//when a user removes their own reaction
// 					collector.on('remove', (reaction, user) => {
// 						//delet the user from the votes array
// 						newvotes[reaction.emoji.name].delete(user);
// 						//run update function
// 						updatevotes();
// 					});
// 					resolve();
// 				}
// 			})
// 		})


// 	})//end promise
// }

// //async function to chain rebuild functions to follow each other - for single user
// async function restartcollector(message) {

// 	try {
// 		await rebuildcollectorstate(message)
// 		await clearboard(message)
// 		await restartvotes(message)
// 	} catch (err) {
// 		console.log(err)
// 	}

// }//end function

//=======================================
//		team card bot	|	Functions
//=======================================

//initiate some variables for global use
//teams = ['egg-streme', 'yolksters', 'sunny-side', 'fowl-play', 'hard-boiled', 'over-easy'];
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
