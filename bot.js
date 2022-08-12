/*const Discord = require('discord.js');
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });*/

const { Client, Intents, MessageEmbed } = require('discord.js')
const allIntents = new Intents(32767);
const client = new Client({ intents : allIntents, partials: ['MESSAGE', 'CHANNEL', 'REACTION'] })

// ---- Info ----
// home team should be under category including word "home"
// channel names under "home" category should contact a match for the role (e.g. "Home Teams" category should contain a channel "team egg-streme" and the "egg-streme" part should match a server role for the team)
// this is what we will use to establish the teams that there are
// ---- ---- ----


//!test command for testing things
client.on('message', async message => {
	if (message.content.includes("!test")) {
		console.log(master[message.guild.id][teams])
	}
})


//=================================================
//  Coop bot | Functions | Initalise
//  1. Log startup to console + array status boards
//  2. Build initial team object during !coop open
//=================================================

// 1. Report ready to console and build array of open coop boards

var master = {}

client.on('ready', () => {
	startthinking(3000, false)

	//establish server specific storage objects
	var serverlist = client.guilds.cache.map(guild => guild.id);
	console.log('I am online on ' + serverlist.length + ' servers. They are :' + serverlist);
	for (var i = 0; i < serverlist.length; i++) {
		master[serverlist[i]] = { 'teams': {}, 'teammembers': {}, 'lastmessage': {} }
	}

	//build arrary of open status boards
	arraystatusboards()
	console.log('I am ready!')
});

//define global storage objects
//var teams = {}//this one is for just the teams/roles that match the home team channels
//var teammembers = {}//the main data storage for the status board. Team titles and team members with squares and farming status
//var lastmessage = {}//store the last retrieved message for last access.

// 2. Function to build team object from home team channels. This object contains the teams and team members. 🟥's added. Run during !coop open
async function buildteamobj(interaction) {
	
	//get array of all server roles
	const guild = client.guilds.cache.get("695793841592336426")
	var roles = guild.roles.cache.map((role) => role.name);
	
	//get discord category channels (e.g 🏠 Home Teams)
	const categoryChannels = guild.channels.cache.filter(channel => channel.type === "GUILD_CATEGORY");
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
	

await guild.members.fetch() //cache all members in the server

	
	
	for (var i = 0; i < homechannels.length; i++) {
		for (var j = 0; j < roles.length; j++) {
			//if a channel has a role/team match
			if (homechannels[i].includes(roles[j])) {
				//first lets save the team name itself for use by other functions
				teamnames.push(roles[j])
				//clean the role of any special characters (remove hyphenation) for keying team member storage in the teams object.
				var cleanrole = roles[j].replace(/[^a-zA-Z0-9 ]/g, "");
				//find the role in the sever cache which matches the channel-matched role (we will need it's ID)
				let role = guild.roles.cache.find(r => r.name === roles[j]);
				
const thesemembers = role.members.map(m => m.displayName);
				//store members in the team members object, keyed by cleaned team name
				console.log(thesemembers)
				master['695793841592336426'].teammembers[cleanrole] = thesemembers
			}//end if match
		}//end for roles
	}//end for homechannels

	var idcounter = 0

	//add red squares
	for (let key in master['695793841592336426'].teammembers) {
		for (var i = 0; i < master['695793841592336426'].teammembers[key].length; i++) {
			hexid = idcounter.toString()
			hexid = hexid.padStart(2, "0")
			hexid = hexid.toUpperCase()
			idcounter = idcounter + 1
			master['695793841592336426'].teammembers[key][i] = "🟥 💤 - " + master['695793841592336426'].teammembers[key][i] + " (+" + hexid + ")"
		}//end for each team member
	}//end for each team
	idcounter = 0
	//store the teams (roles) in the object
	master['695793841592336426'].teams = teamnames;
	return
}//end function

//=======================================
//  Coop bot | Functions | Processing
//  1. Emoji processing lock function
//  2. Delay/wait functions
//=======================================

var processingMaster = false//Global lockout - when processingMaster is true, nothing else should run. initalise on false
var processingSquares = false//processing lockout for square color change. NOT CURRENTLY USED/NEEDED. Emoji lockout controls flow
var processingEmoji = false//processing lockout for when we are processing emoji changes
var emojiQueueCount = 0//counter of the number of emoji changes in the processing queue. When 0 an attempt can be made to unlock car processingEmoji

// 1. emoji processing lock/unlock functiom
async function emojilock(lock) {
	if (lock === true) { processingEmoji = true; console.log("Locking emoji processing") }//if lock is true, set emojiprocessing to true

	if (lock === false && emojiQueueCount == 0) {//if function is called with false, then unlock if no more emoji's are in queue
		console.log("delaying 15 seconds before trying to unlock emoji processing");
		await delay(15000);
		console.log("rechecking after wait if we can unlock")
		if (emojiQueueCount == 0) {//if still 0. Another emoji could have came in during the 15 seconds
			processingEmoji = false
			console.log("unlocked emoji processing")
		} else (console.log("emojiqueuecount was not 0. Didnt unlock"))
	}//end if lock === false (unlock attempt)
}//end function

// 2. Delay functions. Can be used with await delay (x) and code in async function will wait for x milliseconds before continue
const delay = async (ms) => new Promise(res => setTimeout(res, ms));//delay function used by startthinking function
const startthinking = async (x, message) => {
	if (message !== false) {
		//do this first
		processingMaster = true
		message.channel.sendTyping()//start discord typing signifier
		console.log("Starting to think for " + x / 1000 + " seconds. processingMaster var is: " + processingMaster)
		await delay(x)//wait for x milliseconds
		//then do this
		processingMaster = false
		console.log("Done thinking for " + x / 1000 + " seconds. processingMaster var is: " + processingMaster)
	}//end if not false

	if (message === false) {
		//do this first
		processingMaster = true
		console.log("No message recieved. Starting to think for " + x / 1000 + " seconds. processingMaster var is: " + processingMaster)
		await delay(x)//wait for x milliseconds
		//then do this
		processingMaster = false
		console.log("No message recieved. Done thinking for " + x / 1000 + " seconds. processingMaster var is: " + processingMaster)
	}//end if false
}//end start thinking function

//======================================================
//	Coop bot | Functions | Reaction Status (👍❌🥚💤)
//  1. ebucket - emoji queue (bucket) function
//  2. Message reaction add listener
//  3. Refresh array of currently open coops
//  4. Emoji swapper function
//======================================================

//object containing the locks for the task queue.
var elocks = { e0locked: false, e1locked: false, e2locked: false, e3locked: false, e4locked: false, e5locked: false, e6locked: false, e7locked: false }
// 1. ebucket function (processingMaster queue). Holds message in one bucket untill the next one unlocks and the message can flow in
function ebucket(message, emoji, user, lockobject, thislock, nextlock, loopdelay, queuename) {
	return new Promise((resolve, reject) => {
		if (lockobject[nextlock] === true) {//if the next bucket is locked
			lockobject[thislock] = true; console.log(queuename + " locked")//lock this bucket
			let bdelay = loopdelay//set a local variable from the one passed to function. It will increse each loop
			let qloop = setTimeout(function request() {//establish function which calls itself
				if (lockobject[nextlock] === true) {//on this loop, if the next bucket is locked, increase timeout and loop again
					bdelay *= 1.1;//add 10% to the length of delay
					qloop = setTimeout(request, bdelay);//call another loop
				}//end if nextlock is true
				if (lockobject[nextlock] === false) {//on this loop if the next bucket is now open, send message to it and unlock this one
					resolve({ message: message, emoji: emoji, user: user })//return message
					lockobject[thislock] = false; console.log(queuename + " unlocked")//unlock this bucket so messages can flow in from above
				}//end if nextlock is false
			}, bdelay);//end qloop/setTimeout function
		} else { console.log(message.guild.id + ': skipping ' + queuename + ' queue'); resolve({ message: message, emoji: emoji, user: user }) }//if the next bucket wasnt locked, we can pass the message straight through
	})//end promise
}//end bucket function

// 2. reaction add listener
client.on('messageReactionAdd', async (reaction, user) => {
  console.log('reaction added')
	// When we receive a reaction we check if the reaction is partial or not
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
			console.log(reaction.message.guild.id + ': a partial reaction was fetched')
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}//end catch
	}//end if reaction.partial
console.log('status board length is ' + statusboardmessages.length)
	//when reaction is added, check the ID of the message it was added to. If it matches one of the open status boards then...
	for (var i = 0; i < statusboardmessages.length; i++) {
		if (statusboardmessages[i].includes(reaction.message.id)) {

			//I will need a message object. need to get the channel and message ID from reaction, then fetch it to be used by these functions below.
			var thischannel = reaction.message.channel.id
			var thismessage = reaction.message.id

			//get displayname from userid. Need this for the string match in the status board/teammembers object
			//check if they have a nickname set
			var getmember = await client.users.fetch(user.id)//retrieve the user from ID
			console.log(getmember)
			
			
			
			const member = await client.guilds.cache.find((guild) => guild.id === '695793841592336426').members.cache.find((member) => member.user.id === getmember.id )
			
			//const member = await client.members.cache.fetch(getmember.id);

console.log(member)
			var dName = member.nickname//set dName (displayName) to the member object's nickname
			var uName = getmember.username//if they dont have a nickname, thier username is what is displayed by discord.
			var thisuser = ""
			//if both dname and uName are not null, we must have found a nickname (this user has both). Therefore return nickname, or instead set thisuser to the username
			if (dName !== null) { thisuser = dName } else { thisuser = uName }

			//proceed futher only if user was not one of our bots
			if (!(thisuser == "EiP Bot" || thisuser == "EiP Dev Bot")) {
				//remove any reaction that wasnt by one of our bots
				if (reaction.emoji.name == "👍") { reaction.message.reactions.cache.find(reaction => reaction.emoji.name == "👍").users.remove(user.id) }
				if (reaction.emoji.name == "❌") { reaction.message.reactions.cache.find(reaction => reaction.emoji.name == "❌").users.remove(user.id) }
				if (reaction.emoji.name == "🥚") { reaction.message.reactions.cache.find(reaction => reaction.emoji.name == "🥚").users.remove(user.id) }
				if (reaction.emoji.name == "💤") { reaction.message.reactions.cache.find(reaction => reaction.emoji.name == "💤").users.remove(user.id) }
				if (reaction.emoji.name == "🟥") { reaction.message.reactions.cache.find(reaction => reaction.emoji.name == "🟥").users.remove(user.id) }
				if (reaction.emoji.name == "🔶") { reaction.message.reactions.cache.find(reaction => reaction.emoji.name == "🔶").users.remove(user.id) }
				if (reaction.emoji.name == "🟢") { reaction.message.reactions.cache.find(reaction => reaction.emoji.name == "🟢").users.remove(user.id) }

				//log whats going to happen
				console.log(reaction.message.guild.id + ": " + thisuser + "reacted with " + reaction.emoji.name + " on status board message: " + reaction.message.id)

				//we are only going further into the function with one of these emoji
				var allowedemoji = ['🟥', '🔶', '🟢', '👍', '❌', '🥚', '💤']

				if (allowedemoji.includes(reaction.emoji.name)) {

					//add one to the queue count. Needs to be 0 before we can leave emoji processing
					emojiQueueCount = emojiQueueCount + 1

					//get the message object for the status board which recieved the reaction, then...
					await client.channels.cache.get(thischannel).messages.fetch(thismessage).then(async msg => {
						if (elocks.e7locked === false || elocks.e6locked === false) {//try all the queues. Maximum is 1 running plus 7 waiting
							console.log(reaction.message.guild.id + ": " + msg.content + 'just entered the top of the stack above e7')
							await ebucket(msg, reaction.emoji.name, thisuser, elocks, 'e7locked', 'e6locked', 1000, 'e7').then(async result => {
								console.log(reaction.message.guild.id + ': Reaction: ' + result.emoji + ' for ' + result.user + ' passed from e7 to e6')
								await ebucket(result.message, result.emoji, result.user, elocks, 'e6locked', 'e5locked', 1000, 'e6').then(async result => {
									console.log(reaction.message.guild.id + ': Reaction: ' + result.emoji + ' for ' + result.user + ' passed from e6 to e5')
									await ebucket(result.message, result.emoji, result.user, elocks, 'e5locked', 'e4locked', 1000, 'e5').then(async result => {
										console.log(reaction.message.guild.id + ': Reaction: ' + result.emoji + ' for ' + result.user + ' passed from e5 to e4')
										await ebucket(result.message, result.emoji, result.user, elocks, 'e4locked', 'e3locked', 1000, 'e4').then(async result => {
											console.log(reaction.message.guild.id + ': Reaction: ' + result.emoji + ' for ' + result.user + ' passed from e4 to e3')
											await ebucket(result.message, result.emoji, result.user, elocks, 'e3locked', 'e2locked', 1000, 'e3').then(async result => {
												console.log(reaction.message.guild.id + ': Reaction: ' + result.emoji + ' for ' + result.user + ' passed from e3 to e2')
												await ebucket(result.message, result.emoji, result.user, elocks, 'e2locked', 'e1locked', 1000, 'e2').then(async result => {
													console.log(reaction.message.guild.id + ': Reaction: ' + result.emoji + ' for ' + result.user + ' passed from e2 to e1')
													await ebucket(result.message, result.emoji, result.user, elocks, 'e1locked', 'e0locked', 1000, 'e1').then(async result => {
														console.log(reaction.message.guild.id + ': Reaction: ' + result.emoji + ' for ' + result.user + ' passed from e1 to e0')
														//queue 0
														if (processingMaster === true && elocks.e0locked === false) {//if there is currently another command processingMaster and this queue isnt locked
															elocks.e0locked = true; console.log(reaction.message.guild.id + ": e0 locked")//lock this queue
															//console.log('Message: ' + message.content + ' is about to go into the queue 0 waiting loop. processingMaster var was ' + processingMaster)
															do {//while processingMaster = true, loop around in 1 second intervals
																console.log(reaction.message.guild.id + ': One loop in queue 0 for reaction : ' + result.emoji + ' for ' + result.user)
																await delay(1000)
															} while (processingMaster === true)
															elocks.e0locked = false; console.log(reaction.message.guild.id + ": e0 unlocked")//unlock this queue
														}//end queue 0

														console.log(reaction.message.guild.id + ': Reaction : ' + result.emoji + ' for ' + result.user + ' has just passed all e-queues')//message is now free to enter rest of function
														await emojilock(true)//stop other processing types
														startthinking(12000, result.message)//lock out any more commands for x millisecond
														emojiQueueCount = emojiQueueCount - 1//this one is now being processed. Let's remove it from queue count
														console.log(reaction.message.guild.id + ': emoji q count is: ' + emojiQueueCount + ' processing emoji is: ' + processingEmoji)
														try {
															await rebuildteamobj(result.message)//rebuild the teammembers object for *this* status board
															await changeplayerstatus(result.emoji, result.user, reaction.emoji.name, reaction.message.guild.id)//update the user in the teammembers object with the new emojj
															await updateplayerboard(result.message, 'emoji')//now the teammembers object is updated, republish the status board
															await emojilock(false)
														} catch (err) {
															console.log(err)
														}//end catch error
													})//end q1
												})//end q2
											})//end q3
										})//end q4
									})//end q5
								})//end q6
							})//end q7
						}//end if q7, q6 or 15 is locked
						else {
							reaction.message.channel.send('Woah, Woah, Woah! What are you trying to do to me? That\'s far too many reactions silly human! Please wait 15 seconds and try to add your reaction again')
							emojiQueueCount = emojiQueueCount - 1
						}//end else (for queue is full)
					})//end fetch statusboard message then...
				}//end if allowed reaction
			} else { console.log(reaction.message.guild.id + ': Reacting user was a bot') }//end if not bots

		}//end if reaction message is a statusboard message
	}//end for loop checking through stored reaction board message ids for a match for this reaction add
});//end client on reaction add 

//global var array to we can find status board messages later and/or filter the reactionAdd event to these message IDs. Rebuilt on startup and when any reaction is added to a status board message
var statusboardmessages = []
// 3. function to rebuild statusboardmessages with open coop status boards
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

// 4. function to swap any of the 4 emoji for the clicked one (swaps in bot memory, need to update status board)
function changeplayerstatus(newemoji, user, reactionemoji, guildid) {
	//log the change we are making
	console.log(guildid + ': in changeplayerstatus function. User: ' + user + 'just changed thier status to: ' + newemoji)
	return new Promise((resolve, reject) => {
		//work out which emoji set we are replacing based on the reaction
		var oldemoji = []; var coopemoji = ['🟥', '🔶', '🟢']; var playeremoji = ['👍', '❌', '🥚', '💤']
		//which emoji set are we making a replacement in for this changeplayerstatus?
		if (coopemoji.includes(reactionemoji)) { oldemoji = coopemoji } else { oldemoji = playeremoji }
		//loop through all teams/users for the memeber we are looking for, then update thier emoji in the teammembers object
		for (var i = 0; i < master[guildid].teams.length; i++) {
			//for each of the teams (roles)
			var cleanrole = master[guildid].teams[i].replace(/[^a-zA-Z0-9 ]/g, "");//teammebers object is keyed with a cleaned version of role (no hyphen) 
			//loop through teammembers object looking for the user displayname which was provided. If found, replace emoji and save back into object
			for (var j = 0; j < master[guildid].teammembers[cleanrole].length; j++) {
				if (master[guildid].teammembers[cleanrole][j].includes(user)) {
					let str = master[guildid].teammembers[cleanrole][j];
					let res = str.replace(oldemoji[0], newemoji).replace(oldemoji[1], newemoji).replace(oldemoji[2], newemoji).replace(oldemoji[3], newemoji);
					master[guildid].teammembers[cleanrole][j] = res;
				} //end replace emoji core function
			}//end for this team loop
		}//end teams for loop
		resolve(true);
	})//end promise
}//end of changeplayerstatus function

//========================================================
// Coop bot | Functions | Coop status (🟥🔶🟢)
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
				let embed = msg.embeds[0]//embed[0] is first/only embed in message. Copy it to embed variable
				if (embed != undefined && embed.footer.text.includes('LaniakeaSC')) {//find the right pinned message
					console.log('found a pinned statusboard message with ID: ' + msg.id)
					resolve(msg)//return the statusboard
				}//end if embed and footer text contains
			})//end message.forEach
		})//end .then after fetchPinned
	})//end promise
}//end function findstatusboard

// 2. Function to rebuild teammembers object by finding it in the channel the command was sent
function rebuildteamobj(message) {
	return new Promise((resolve, reject) => {
		console.log('rebuilding team object')
		master[message.guild.id].teammembers = {}//clear object for rebuilding it
		var teamnames = []//define teams array, team names will be stored here for use by other functions
		message.channel.messages.fetchPinned().then(messages => {//fetch pinned messages from this channel then...
			messages.forEach(message => {//for each pinned message 
				let embed = message.embeds[0];//embed[0] is first/only embed in message. Copy it to embed variable
				if (embed != null && embed.footer.text.includes('LaniakeaSC')) {//find the right pinned message
					for (var i = 0; i < embed.fields.length; i++) {//for each of the fields (teams) in the embed
						var thesemembers = embed.fields[i].value//get the values (team members). Is loaded as string with \n after each player
						thesemembers = thesemembers.split('\n')//split into array. thesemembers is now array of team members with thier current status square
						var thisteam = embed.fields[i].name.split(' ').pop()//the title of each fiels is set to "Team " followed by the team name (e.g "egg-streme"). Split at ' ' and pop to get just team (role) name
						teamnames.push(thisteam)//save the team (role) name itself for use by other functions
						var cleanrole = thisteam.replace(/[^a-zA-Z0-9 ]/g, "")//clean the role of any special characters (remove hyphenation) for keying team member storage in the teams object.
						master[message.guild.id].teammembers[cleanrole] = thesemembers//store members in the team members object, keyed by cleaned team name
						thismessage = message//store message to get URL
					}//end for loop
					resolve(true)
				}//end if embed and footer text contains
			})//end message.forEach
		})//end .then after fetchPinned
		master[message.guild.id].teams = teamnames//store the teams in the master object
	})//end promise
}//end function rebuildteamobj 

// 3a. function to loop through all of the team arrarys looking for the user and change thier square colour
function changeusersquare(oldsq1, oldsq2, newsq, user, message) {
	console.log(message.guild.id)
	return new Promise((resolve, reject) => {
		for (var i = 0; i < master[message.guild.id].teams.length; i++) {//for each of the teams (roles)
			var cleanrole = master[message.guild.id].teams[i].replace(/[^a-zA-Z0-9 ]/g, "")//teammebers object is keyed with a cleaned version of role (no hyphen)
			for (var j = 0; j < master[message.guild.id].teammembers[cleanrole].length; j++) {//loop through teammembers object looking for the user displayname which was provided. If found, replace oldsq1 or oldsq2 with newsq and save back into object
				if (master[message.guild.id].teammembers[cleanrole][j].includes(user)) {
					let str = master[message.guild.id].teammembers[cleanrole][j]; let res = str.replace(oldsq1, newsq).replace(oldsq2, newsq); master[message.guild.id].teammembers[cleanrole][j] = res;
				} //end replace square core function
			}//end for this team loop
		}//end teams for loop
		resolve(true)
	})//end promise
}//end of changeusersquare function

// 3b. function to change whole team's squares at once
function changeteamsquare(oldsq1, oldsq2, newsq, team, message) {
	return new Promise((resolve, reject) => {
		var cleanrole = team.replace(/[^a-zA-Z0-9 ]/g, "")//teammebers object is keyed with a cleaned version of role (no hyphen)
		for (var i = 0; i < master[message.guild.id].teammembers[cleanrole].length; i++) {//access teammembers object at cleaned teamname provided. If found, replace oldsq1 or oldsq2 with newsq and save back into object
			let str = master[message.guild.id].teammembers[cleanrole][i]; let res = str.replace(oldsq1, newsq).replace(oldsq2, newsq); master[message.guild.id].teammembers[cleanrole][i] = res;
		}//end for loop
		resolve(true)
	})//end promise
}//end of changeteamsquare function

// 4. function to republish the player status board from current state of arrays
function updateplayerboard(message, source) {
	return new Promise((resolve, reject) => {
		console.log('updating player board with source: ' + source)
		message.channel.messages.fetchPinned().then(messages => {//fetch pinned messages
			messages.forEach(message => {//for each pinned message
				let embed = message.embeds[0]//embed[0] is first/only embed in message. Copy it to embed variable
				if (embed != null && embed.footer.text.includes('LaniakeaSC')) {//find the right pinned message
					var receivedEmbed = message.embeds[0]; //copy embeds from it
					var updatedEmbed = new MessageEmbed(receivedEmbed) //make new embed for updating in this block with old as template
					updatedEmbed.fields = []//clear fields
					//add teams and players for embed from teams/teammeber objects
					for (var i = 0; i < master[message.guild.id].teams.length; i++) {
						var cleanrole = master[message.guild.id].teams[i].replace(/[^a-zA-Z0-9 ]/g, "");//teammebers object is keyed with a cleaned version of role (no hyphen)
						updatedEmbed.addField(`Team ${master[message.guild.id].teams[i]}`, master[message.guild.id].teammembers[cleanrole], false)
					}//end loop through teams updating from memory teammembers object
					message.edit(updatedEmbed)//send the updated embed
					resolve(true)
				}//end if embed and footer text contains
			})//end message.forEach
		})//end .then after fetchPinned 
	})//end promise
}//end function updateplayerboard

// 5a. async function to chain rebuild functions to follow each other - for single user
async function updateplayersquare(oldsq1, oldsq2, newsq, user, message, source) {
	try {
		console.log('user ' + user + ' started being updated to ' + newsq)
		await rebuildteamobj(message)//rebuild memory object from message passed to function
		await changeusersquare(oldsq1, oldsq2, newsq, user, message)//change squares in the memory object
		await updateplayerboard(message, source)//update player board from memory object
		console.log('user ' + user + ' finished being updated to ' + newsq)
	} catch (err) { console.log(err) }
}//end function

// 5b. async function to chain rebuild functions to follow each other - for team
async function updateteamsquare(oldsq1, oldsq2, newsq, team, message, source) {
	try {
		console.log('team ' + team + ' started being updated to ' + newsq)
		await rebuildteamobj(message)//rebuild memory object from message passed to function
		await changeteamsquare(oldsq1, oldsq2, newsq, team, message)//change squares in the memory object
		await updateplayerboard(message, source)//update player board from memory object
		console.log('team ' + team + ' finished being updated to ' + newsq)
	} catch (err) { console.log(err) }
}//end function

async function updateHEXplayersquare(oldsq1, oldsq2, newsq, message, playerid, source) {
	console.log('starting replace by hex')
	console.log('playerid is: ' + playerid)

	try {
		await rebuildteamobj(message)
		let user = await hexsearch(playerid, message)
		console.log('user is: ' + user)
		var trimuser = user.substring(user.indexOf("-") + 1, user.indexOf('(') - 1)
		console.log('user is now: ' + trimuser)
		await changeusersquare(oldsq1, oldsq2, newsq, trimuser, message)//change squares in the memory object
		await updateplayerboard(message, source)//update player board from memory object
		console.log('user ' + user + ' finished being updated to ' + newsq)

	} catch (err) { console.log(err) }
}

async function hexsearch(id, message) {
	return new Promise((resolve, reject) => {
		for (var i = 0; i < master[message.guild.id].teams.length; i++) {//for each of the teams (roles)
			var cleanrole = master[message.guild.id].teams[i].replace(/[^a-zA-Z0-9 ]/g, "")//teammebers object is keyed with a cleaned version of role (no hyphen)
			for (var j = 0; j < master[message.guild.id].teammembers[cleanrole].length; j++) {//loop through teammembers object looking for the user displayname which was provided. If found, replace oldsq1 or oldsq2 with newsq and save back into object
				if (master[message.guild.id].teammembers[cleanrole][j].includes(id)) {
					console.log('found user with id: ' + id)
					resolve(master[message.guild.id].teammembers[cleanrole][j])
				} //end replace square core function
			}//end for this team loop
		}//end teams for loop
	})//end promise 
}//end function

//=======================================================
// Coop bot | Functions | other
// 1. Check if user is valid
// 2. Check if the team is valid
// 3. Get displayname for those that have changed thiers
// 4. Thank you message for colour change 
//=======================================================

// 1. check if the user is on one of the home teams
async function checkifvaliduser(message, user) {
	await rebuildteamobj(message)//rebuild team object so we can search through valid users
	var teammembervalues = Object.values(master[message.guild.id].teammembers)//get all the values from the object
	var merged = [].concat.apply([], teammembervalues)//merge all values into 1 dimensional array
	var found = merged.find(element => element.includes(user))//search merged array for user passed to function. If there, return user, else undefined
	//if user passed to function is in that array, return true, else false
	if (typeof found !== 'undefined') { return true } else { return false }
}//end function validuser

// 2. check if the role/team mentioned is one of the valid home teams
async function checkifvalidteam(message, team) {
	await rebuildteamobj(message)
	console.log("team:" + team)//rebuild team object so we can search through valid users
	var validteams = Object.values(master[message.guild.id].teams)//get all the values from the object
	var merged = [].concat.apply([], validteams)//merge all values into 1 dimensional array
	var found = merged.find(element => element.includes(team))//search merged array for user passed to function. If there, r
	//if team passed to function is in that array, return true, else false
	if (typeof found !== 'undefined') { return true } else { return false }
}//end function validteam

// 3. function to get displayname for those that have changed thiers. Returns regular username if they dont have a nickname
function getname(message) {
	if (message.mentions.users.size !== 0) {//first check if there were indeed any mentioned users
		var userid = message.mentions.users.first().id;//get the ID of the first mention
		//check if they have a nickname set
		const member = message.guild.member(userid);//retrieve the user from ID
		var dName = member.nickname;//set dName (displayName) to the member object's nickname
		var uName = message.mentions.users.first().username;//if they dont have a nickname, thier username is what is displayed by discord.
		//if both dname and uName are not null, we must have found a nickame. Therefore return it, or instead return the username
		if (dName !== null && uName !== null) { return dName } else { return uName };
	}//end if mentions size !== 0
}//end getname function

// 4. function to delete color change input command and reply with a thank you/wait message
function thankyou(author, updatedthis, color, message) {
	var commandchannel = message.channel.name
	//make new discord embed. Tidier than normal message
	thanksembed = new MessageEmbed()
	thanksembed.setDescription('Thank you ' + author + ' for updating ' + updatedthis + 'using command ' + message.content + ' in channel ' + commandchannel + '. Coop board will update in 12-15 seconds.')
	thanksembed.addField("Jump to coop board", thismessage.url)

	var botoutputchannel = message.guild.channels.cache.find(channel => channel.name === "🤖bot-status")

	botoutputchannel.send(thanksembed)
	message.delete()//delete the input message
}//end thankyou function

//==========================================
// Coop bot	| User Commands | open and close
// 1. !Coop (which has open and close)
//==========================================

//setup slash command
client.on('ready', () => {
	client.api.applications(client.user.id).guilds('695793841592336426').commands.post({//adding commmand to our servers
		data: {
			"name": "start",
			"description": "Start a new coop",
			"options": [
				{
					"type": 3,
					"name": "open",
					"description": "Enter coop name",
					"required": true
				}
			]
		}//end data
	})//end post
})

//reply to slash command
client.ws.on('INTERACTION_CREATE', async interaction => {

	const command = interaction.data.name.toLowerCase()
	const coopname = interaction.data.options[0]//array of the provided data after the slash

	if (command === 'start') {
		console.log('Start command!')

		if (processingMaster === false) {

			//lock out any more commands for x milliseconds
			startthinking(6000, false)
			//unpin status board message
			var interactionchannel = interaction.channel_id
			var channel = await client.channels.fetch(interactionchannel)
			let messages = await channel.messages.fetchPinned()
			
				messages.forEach(message => {
					//embed[0] is first/only embed in message. Copy it to embed variable
					let embed = message.embeds[0];
					//find the right pinned message
					if (embed != null && embed.footer.text.includes('LaniakeaSC')) {
						message.unpin()
					}//end if embed and footer text contains
				})//end message.forEach
			

			//initialise teams object (becasue this is the !coop open command). We don't seem to need to await this? Seems to work. 
			console.log('before build team object one !open')
			console.log(master[interaction.guild_id].teammembers)

			await buildteamobj(interaction)

			console.log('after build team object before !open')
			console.log(master[interaction.guild_id].teammembers)


    
				
				
				
				
				
			//add teams and players for embed from teams/teammeber objects
			var embedteams = []
			for (var i = 0; i < master[interaction.guild_id].teams.length; i++) {
				var cleanrole = master[interaction.guild_id].teams[i].replace(/[^a-zA-Z0-9 ]/g, "");//teammebers object is keyed with a cleaned version of role (no hyphen). Uncleaned roles are in teams object
				console.log('cleanrole is: ' + cleanrole)
				console.log('length is: ' + master[interaction.guild_id].teammembers[cleanrole].length)
				if (master[interaction.guild_id].teammembers[cleanrole].length != 0) {
					embedteams.push({ "name" : `Team ${master[interaction.guild_id].teams[i]}`, "value" : master[interaction.guild_id].teammembers[cleanrole].join('\n'), "inline" : false})
				}
			}//end loop to add team fields to embed
			console.log(embedteams)
						//build initial embed
			let placedEmbed = [
        {
          "title": "EiP Status Board for contract: " + coopname,
          "color": '#00FF00',
          "description": '__Player Status__\nPlease add a reaction below to tell us if you are farming this contract.\n👍 if you are farming\n❌ if you are not farming\n🥚 if you would like to be a starter\n💤 to reset your choice\n\n__Coop Status__\nThe squares below represent the status of the coop\n🟥 - Player not yet offered coop\n🔶 - Player offered coop\n🟢 - Player is confirmed in coop',
          "fields" : embedteams,
          "footer": {
            "text": 'Bot created by LaniakeaSC (type !help for more info)\n⬇️ Please add a reaction below ⬇️' 
          }
        }
      ]//end embed
			
			client.guilds.cache.get(interaction.guild_id).channels.cache.get(interaction.channel_id).send( {
            embeds: placedEmbed
          }
        ).then(async msg => {//send the embed then
				console.log('pushing message id: ' + msg.id)
				statusboardmessages.push(msg.id)
				await msg.react('👍'); await msg.react('❌'); await msg.react('🥚'); await msg.react('💤')//add player status reactions
				await msg.react('🟢'); await msg.react('🔶'); await msg.react('🟥')//add coop status reactions
				await delay(500); await msg.pin();//pin message after 500 milliseconds
			})//end pin placed user embed
		} else { channel.send('Sorry, I am processing another task right now. Please try this command again in 30 seconds'); console.log('skipping !open command becasuse ') }
	}
})

// 1. !coop (including !coop open [name] and !coop close)
client.on('message', async message => {
	if (message.content.startsWith("!coop")) {
		if (processingMaster === false) {

			//first lets split up commands
			let msg = message.content;//transfer message contents into msg
			let argString = msg.substr(msg.indexOf(' ') + 1);//make substring from first space onwards (after!coop)
			let argArr = argString.split(' ');//split into multiple parts and store in array - might get errors if more then 3 parts?
			let [eggcommand1, eggcommand2, eggcommand3] = argArr;//for each element in array, make into variable

			console.log('!coop detected. Commmand 1 is: ' + eggcommand1 + '. Command 2 is: ' + eggcommand2 + '. Command 3 is: ' + eggcommand3);

			//open a new coop
			if (eggcommand1 == 'open' && String(eggcommand2) !== "undefined") {
				//lock out any more commands for x milliseconds
				startthinking(6000, message)
				//unpin status board message
				message.channel.messages.fetchPinned().then(messages => {
					messages.forEach(message => {
						//embed[0] is first/only embed in message. Copy it to embed variable
						let embed = message.embeds[0];
						//find the right pinned message
						if (embed != null && embed.footer.text.includes('LaniakeaSC')) {
							message.unpin()
						}//end if embed and footer text contains
					})//end message.forEach
				})//end .then messages:

				//initialise teams object (becasue this is the !coop open command). We don't seem to need to await this? Seems to work. 
				console.log('before build team object one !open')
				console.log(master[message.guild.id].teammembers)

				buildteamobj()

				console.log('after build team object before !open')
				console.log(master[message.guild.id].teammembers)

				//build initial embed
				let placedEmbed = new MessageEmbed()
					.setTitle("EiP Status Board for contract: " + eggcommand2)
					.setDescription('__Player Status__\nPlease add a reaction below to tell us if you are farming this contract.\n👍 if you are farming\n❌ if you are not farming\n🥚 if you would like to be a starter\n💤 to reset your choice\n\n__Coop Status__\nThe squares below represent the status of the coop\n🟥 - Player not yet offered coop\n🔶 - Player offered coop\n🟢 - Player is confirmed in coop')
					.setColor('#00FF00')
					.setFooter('Bot created by LaniakeaSC (type !help for more info)\n⬇️ Please add a reaction below ⬇️')

				//add teams and players for embed from teams/teammeber objects
				for (var i = 0; i < master[message.guild.id].teams.length; i++) {
					var cleanrole = master[message.guild.id].teams[i].replace(/[^a-zA-Z0-9 ]/g, "");//teammebers object is keyed with a cleaned version of role (no hyphen). Uncleaned roles are in teams object
					if (master[message.guild.id].teammembers[cleanrole].length != 0) {
						placedEmbed.addField(`Team ${master[message.guild.id].teams[i]}`, master[message.guild.id].teammembers[cleanrole], false)
					}
				}//end loop to add team fields to embed

				message.channel.send(placedEmbed).then(async msg => {//send the embed then
					//push the message ID into global var array to we can find these messages later and/or filter the reactionAdd event to these message IDs.
					statusboardmessages.push(msg.id);
					console.log("Coop opened. Current Status Boards are: " + statusboardmessages)
					await msg.react('👍'); await msg.react('❌'); await msg.react('🥚'); await msg.react('💤')//add player status reactions
					await msg.react('🟢'); await msg.react('🔶'); await msg.react('🟥')//add coop status reactions
					await delay(500); await msg.pin();//pin message after 500 milliseconds
				})//end pin placed user embed
			}//end the if !open

			//close coop
			if (eggcommand1 == 'close') {
				//lock out any more commands for x milliseconds
				startthinking(6000, message)

				await findstatusboard(message).then(statusboard => {
					console.log('Closing statusboard: ' + statusboard)
					statusboard.reactions.removeAll()
					var receivedEmbed = statusboard.embeds[0] //copy embeds from it
					var updatedEmbed = new MessageEmbed(receivedEmbed) //make new embed for updating in this block with old as template
					updatedEmbed.setFooter('Bot created by LaniakeaSC (type !help for more info)\nThis coop is closed')
					updatedEmbed.setColor('#FF0000')
					statusboard.edit(updatedEmbed)
					statusboard.unpin()
					arraystatusboards()//find all statusboard and add to statusboard array
				})//end .then after find status board
			};//end the if !close
			message.delete()//delete input !close command
		} else { message.channel.send('Sorry, I am processing another task right now. Please try this command again in 30 seconds'); console.log('skipping !open command becasuse ') }
	}//end !coop open
});//end client on message

//=======================================
// Coop bot | commands | color change 
// 1. Bucket function (task queue)
// 2. red 🟥
// 3. orange 🔶
// 4. green 🟢
//=======================================

//object containing the locks for the queue.
var sqlocks = { q0locked: false, q1locked: false, q2locked: false, q3locked: false, q4locked: false, q5locked: false, q6locked: false, q7locked: false }

// 1. bucket function (task queue). Holds message in one bucket untill the next one unlocks and the message can flow in
function bucket(message, lockobject, thislock, nextlock, loopdelay, queuename) {
	return new Promise((resolve, reject) => {
		if (lockobject[nextlock] === true) {//if the next bucket is locked
			lockobject[thislock] = true; console.log(queuename + " locked")//lock this bucket
			let bdelay = loopdelay//set a local variable from the one passed to function. It will increse each loop
			let qloop = setTimeout(function request() {//establish function which calls itself
				if (lockobject[nextlock] === true) {//on this loop, if the next bucket is locked, increase timeout and loop again
					bdelay *= 1.1;//add 10% to the length of delay
					qloop = setTimeout(request, bdelay);//call another loop
				}//end if nextlock is true
				if (lockobject[nextlock] === false) {//on this loop if the next bucket is now open, send message to it and unlock this one
					resolve(message)//return message
					lockobject[thislock] = false; console.log(queuename + " unlocked")//unlock this bucket so messages can flow in from above
				}//end if nextlock is false
			}, bdelay);//end qloop/setTimeout function
		} else { console.log('skipping ' + queuename + ' queue'); resolve(message) }//if the next bucket wasnt locked, we can pass the message straight through
	})//end promise
}//end bucket function

//square colour change commands (!red, !orange, !green)
client.on('message', async message => {

	if (message.content.startsWith("!red") || message.content.startsWith("!green") || message.content.startsWith("!orange")) {
		if (sqlocks.q7locked === false || sqlocks.q6locked === false || sqlocks.q5locked === false) {
			//try all the queues. Maximum is 1 plus 7 waiting
			console.log(message.content + 'just entered the top of the stack above q7')
			await bucket(message, sqlocks, 'q7locked', 'q6locked', 1000, 'q7').then(async message => {
				console.log(message.content + ' passed from q7 to q6')
				await bucket(message, sqlocks, 'q6locked', 'q5locked', 1000, 'q6').then(async message => {
					console.log(message.content + ' passed from q6 to q5')
					await bucket(message, sqlocks, 'q5locked', 'q4locked', 1000, 'q5').then(async message => {
						console.log(message.content + ' passed from q5 to q4')
						await bucket(message, sqlocks, 'q4locked', 'q3locked', 1000, 'q4').then(async message => {
							console.log(message.content + ' passed from q4 to q3')
							await bucket(message, sqlocks, 'q3locked', 'q2locked', 1000, 'q3').then(async message => {
								console.log(message.content + ' passed from q3 to q2')
								await bucket(message, sqlocks, 'q2locked', 'q1locked', 1000, 'q2').then(async message => {
									console.log(message.content + ' passed from q2 to q1')
									await bucket(message, sqlocks, 'q1locked', 'q0locked', 1000, 'q1').then(async message => {
										console.log(message.content + ' passed from q1 to q0')

										//queue 0
										if (processingMaster === true && sqlocks.q0locked === false) {//if there is currently another command processingMaster and this queue isnt locked
											sqlocks.q0locked = true; console.log("q0 locked")//lock this queue
											//console.log('Message: ' + message.content + ' is about to go into the queue 0 waiting loop. processingMaster var was ' + processingMaster)
											do {//while processingMaster = true, loop around in 1 second intervals
												console.log('One loop in queue 0 for ' + message.content)
												await delay(1000)
											} while (processingMaster === true || processingEmoji === true)
											sqlocks.q0locked = false; console.log("q0 unlocked")//unlock this queue
										}//end queue 0
										console.log(message.content + 'has just passed all queues')//message is now free to enter rest of function

										//initalise isuser and isteam as false
										var isuser = false;//is the command about a user
										var isteam = false;//is the command about a team
										var ishex = false;//is the command a hex code? 
										var checkeduser = false//is the user a valid user?
										var checkedteam = false//is the team a valid team? 
										var command = ""

										//what user or team was mentioned?
										if (message.mentions.users.size !== 0) {//if a user was mentioned isuser=true
											var mentioneduser = getname(message); isuser = true;
										} else if (message.mentions.roles.size !== 0) {//if a team was mentioned. Isteam = true
											var mentionedrole = message.mentions.roles.first().name; isteam = true;
										} else {

											//check if HEx input
											let themsg = message.content; let argString = themsg.substr(themsg.indexOf(' ') + 1); let argArr = argString.split(' '); let [thiscommand] = argArr;
											console.log('command is: ' + thiscommand)
											thiscommand = thiscommand.toUpperCase()
											if (thiscommand.length === 3 && thiscommand.startsWith("+")) {
												ishex = true
												command = thiscommand
												console.log('found a +3 command')
											}

										}//else do nothing

										if (isuser == true) { checkeduser = await checkifvaliduser(message, mentioneduser) }//check if the user is on a home team
										if (isteam == true) { checkedteam = await checkifvalidteam(message, mentionedrole) }//check if the role mentioned is one of the home team roles


										//!red 🟥
										if (message.content.startsWith("!red") && processingMaster === false) {

											startthinking(18500, message)//lock out any more commands for x millisecond

											//if mention is a valid user
											if (isuser == true && checkeduser == true) {
												await updateplayersquare("🟢", "🔶", "🟥", mentioneduser, message, 'sq')
												thankyou(message.member.displayName, mentioneduser, "red", message)
											}//end if isuser = true
											//if command is a hex
											if (ishex === true) {
												await updateHEXplayersquare("🟢", "🔶", "🟥", message, command, 'sq')
												thankyou(message.member.displayName, command, "red", message)
											}//end if ishex = true
											//if mentioned is a valid team
											if (isteam == true && checkedteam == true) {
												await updateteamsquare("🟢", "🔶", "🟥", mentionedrole, message, 'sq')
												thankyou(message.member.displayName, mentionedrole, "red", message)
											}//end if isteam = true
										}//end !red

										//!orange 🔶
										if (message.content.startsWith("!orange") && processingMaster === false) {

											startthinking(18500, message)//lock out any more commands for x millisecond

											//if mention is a valid user
											if (isuser == true && checkeduser == true) {
												await updateplayersquare("🟢", "🟥", "🔶", mentioneduser, message, 'sq')
												thankyou(message.member.displayName, mentioneduser, "orange", message)
											}//end if isuser = true
											//if ishex = true
											if (ishex === true) {
												await updateHEXplayersquare("🟢", "🟥", "🔶", message, command, 'sq')
												thankyou(message.member.displayName, command, "red", message)
											}//end if ishex = true
											//if mentioned is a valid team
											if (isteam == true && checkedteam == true) {
												await updateteamsquare("🟢", "🟥", "🔶", mentionedrole, message, 'sq')
												thankyou(message.member.displayName, mentionedrole, "orange", message)
											}//end if isteam = true
										}//end !orange

										//!green 🟢
										if (message.content.startsWith("!green") && processingMaster == false) {

											startthinking(18500, message)//lock out any more commands for x millisecond

											//if mention is a valid user
											if (isuser == true && checkeduser == true) {
												await updateplayersquare("🔶", "🟥", "🟢", mentioneduser, message, 'sq')
												thankyou(message.member.displayName, mentioneduser, "green", message)
											}//end if isuser = true
											//if ishex = true
											if (ishex === true) {
												await updateHEXplayersquare("🔶", "🟥", "🟢", message, command, 'sq')
												thankyou(message.member.displayName, command, "red", message)
											}//end if ishex = true
											//if mentioned is a valid team
											if (isteam == true && checkedteam == true) {
												await updateteamsquare("🔶", "🟥", "🟢", mentionedrole, message, 'sq')
												thankyou(message.member.displayName, mentionedrole, "green", message)
											}//end if isteam = true
										}//end !green
									})//end q1
								})//end q2
							})//end q3
						})//end q4
					})//end q5
				})//end q6
			})//end q7
		}//end if q7, q6 or 15 is locked
		else { message.channel.send('Woah, Woah, Woah! What are you trying to do to me? That\'s far too many commands silly human! You are going to have to wait 15 seconds and send this one again: ' + message.content) }
	}//end if !red !orange !green
});//end client on message

//=======================================
//		team card bot	|	Functions
//=======================================

//initiate some variables for global use
ourteams = ['egg-streme', 'yolksters', 'sunny-side', 'fowl-play', 'hard-boiled', 'over-easy'];
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
		teampick = ourteams.filter(checkteam);
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
//member details are first stored in memberdetails, then stored in 2 dimension memberlist. Buildteam function adds the member objects from memberlist (containing member details) to a team specific array ready for processingMaster to output.
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
	const TeamEmbed = new MessageEmbed()
		.setColor(String(color))
		.setTitle(String(title))
		.setDescription(String(description));

	//loop to add the team members to the rich embed. Team specific array contains object for each member, so we loop through them to ad fields to the embed.
	for (var i = 0; i < array.length; i++) {
		TeamEmbed.addFields(
			{ name: array[i][0], value: 'Rank: ' + array[i][3] + '\n' + 'Time Zone: ' + array[i][1] + '\n' + 'Permit: ' + array[i][4], inline: false },
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
