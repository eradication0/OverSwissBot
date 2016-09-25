console.log ('<== STARTING BOT ==>')

const Discord = require('discord.js') //discord
const request = require('request') //jason request from website
const Twitter = require('twitter') //twitter api
const fs = require('fs') //filesystem
const jsonfile = require('jsonfile') //json write/reload
const rand = require('random-int') //number randomizer finally intuitive
const cronJob = require('cron').CronJob //scheduler

console.log ('node modules √')

const dbpath = './db.json'
const clspath = './classes.json'
const botpath = './bot.js'
const newuser = {"credits":0,"exp":1,"daily":0,"class":"","inventory":{"1":"","2":"","3":"","4":"","5":"","6":"","7":"","8":"","9":"","10":""}}

const bot = new Discord.Client()

// function

//GLOBAL VARS
var db = require("./db.json")
var cls = require("./classes.json")
var cred = require("./cred.json")
var awaitid = ""
var charname = ""

// twitter api setup
var client = new Twitter({
	consumer_key: cred.consumer,
	consumer_secret: cred.consumersecret,
	access_token_key: cred.twittertoken,
	access_token_secret: cred.twittertokensecret
})

// Daily reset
var dailyreset = new cronJob({
	cronTime: '00 00 12 * * *',
	onTick: function reset(){
		for(i in db){
			db[i].daily = 0
		}
		console.log("reseted the db")
		jsonfile.writeFile(dbpath, db)
	},
	start: false,
	timeZone: "Europe/Berlin"
})
dailyreset.start()

console.log ('variables √')

bot.on('ready', () => {
	console.log('<== BOT STARTED ==>')
})

//-----------------------------------
// DEBUG/ADMIN
//-----------------------------------
bot.on('message', message => {
	if (message.author.id === bot.user.id) return

	// EVAL
	if (message.content.startsWith('.eval') && message.author.id === '64438454750031872' || message.content.startsWith('.eval') && message.author.id === '148764744231157760') {
		try {
			const com = eval(message.content.split(" ").slice(1).join(" "))
			message.channel.sendMessage('```\n' + com + '```')
		} catch(e) {
			message.channel.sendMessage('```\n' + e + '```')
		}
	}

	//-----------------------------------
	// OTHER STUFF
	//-----------------------------------

	// REMINDER
	if (message.content.startsWith("-reminder")){
		let m = "Your Reminder:\n<https://calendar.google.com/calendar/render?action=TEMPLATE&text="
		m += message.content.slice(10).replace(/\s/g,"+") + ">"
		message.channel.sendMessage(m)
	}

	// NAME
	if (message.content.startsWith('-name'))
	{
		let m = `Hello ${message.content.slice(6)}`
		message.channel.sendMessage(m)
	}

	//-----------------------------------
	// OVERWATCH
	//-----------------------------------

	// COMP PROFILE
	if (message.content.startsWith('-comp'))
	{
		let battletag = message.content.slice(7)
		let url = 'https://api.lootbox.eu/pc/eu/' + battletag.replace('#','-') + '/competitive-play/allHeroes/'
		message.channel.sendMessage(url)
		message.channel.sendMessage('loading from DB...')
		request({
			url: url,
			json: true
		}, function (error, response, body){
			if (!error && response.statusCode === 200){
				body = JSON.stringify(body)
				body = body.replace(/-/g, "")
				body = JSON.parse(body)
				let kd = body.Eliminations
				let Winrate = body.GamesWon / body.GamesPlayed * 100
				let m = ''
				m += '```xl\n'
				m += `${battletag} "Competitive Profile"\n`
				m += `Comp Games Winrate: ${Winrate}%\n`
				m += `Comp Games Played: ${body.GamesPlayed}\n`
				m += `Comp Games Won: ${body.GamesWon}\n`
				m += `Eliminations: ${body.Eliminations}\n`
				m += `Kills/Death: ${body.EliminationsAverage}\n`
				m += `Damage: ${body.DamageDone}\n`
				m += `Heal: ${body.HealingDone}\n`
				m += `Medals: ${body.Medals}\n`
				m += `-Gold Medals: ${body.MedalsGold}\n`
				m += `-Silver Medals: ${body.MedalsSilver}\n`
				m += `-Bronze Medals: ${body.MedalsBronze}\n`
				m += '```'
				message.channel.sendMessage(m)
			}
		})
	}

	// QUICK PROFILE
	if (message.content.startsWith('-quick'))
	{
		let battletag = message.content.slice(7)
		let url = 'https://api.lootbox.eu/pc/eu/' + battletag.replace('#','-') + '/quick-play/allHeroes/'
		message.channel.sendMessage(url)
		message.channel.sendMessage('loading from DB...')
		request({
			url: url,
			json: true
		}, function (error, response, body){
			if (!error && response.statusCode === 200){
				body = JSON.stringify(body)
				body = body.replace(/-/g, "")
				body = JSON.parse(body)
				let kd = body.Eliminations
				let Winrate = body.GamesWon / body.GamesPlayed * 100
				let m = ''
				m += '```xl\n'
				m += `${battletag} "Quick Profile"\n`
				m += `Quick Games Winrate: ${Winrate}%\n`
				m += `Quick Games Played: ${body.GamesPlayed}\n`
				m += `Quick Games Won: ${body.GamesWon}\n`
				m += `Time Played Quick: ${body.TimePlayed}\n`
				m += `Eliminations: ${body.Eliminations}\n`
				m += `Kills/Death: ${body.EliminationsAverage}\n`
				m += `Damage: ${body.DamageDone}\n`
				m += `Heal: ${body.HealingDone}\n`
				m += `Medals: ${body.Medals}\n`
				m += `-credits Medals: ${body.Medalscredits}\n`
				m += `-Silver Medals: ${body.MedalsSilver}\n`
				m += `-Bronze Medals: ${body.MedalsBronze}\n`
				m += '```'
				message.channel.sendMessage(m)
			}
		})
	}

	// QUICK PROFILE RAW
	if (message.content.startsWith('-rawquick'))
	{
		let battletag = message.content.slice(10)
		let url = 'https://api.lootbox.eu/pc/eu/' + battletag.replace('#','-') + '/quick-play/allHeroes/'
		message.channel.sendMessage(url)
		message.channel.sendMessage('loading from DB...')
		request({
			url: url,
			json: true
		}, function (error, response, body){
			if (!error && response.statusCode === 200){
				body = JSON.stringify(body)
				body = body.replace(/-/g, "")
				body = body.replace(/","/g, '",\n"')
				message.channel.sendMessage("```json\n" + body + "```")
			}
		})
	}

	// COMP PROFILE RAW
	if (message.content.startsWith('-rawcomp'))
	{
		let battletag = message.content.slice(10)
		let url = 'https://api.lootbox.eu/pc/eu/' + battletag.replace('#','-') + '/competitive-play/allHeroes/'
		message.channel.sendMessage(url)
		message.channel.sendMessage('loading from DB...')
		request({
			url: url,
			json: true
		}, function (error, response, body){
			if (!error && response.statusCode === 200){
				body = JSON.stringify(body)
				body = body.replace(/-/g, "")
				body = body.replace(/","/g, '",\n"')
				message.channel.sendMessage("```json\n" + body + "```")
			}
		})
	}

	//-----------------------------------
	// TWITTER
	//-----------------------------------
	if (message.content.startsWith('-tweet') && message.author.id === '64438454750031872' || message.content.startsWith('-tweet') && message.author.id === '148764744231157760'){
		let tweetbody = message.content.slice(7)
		if (tweetbody.length <= 140) {
			client.post('statuses/update', {status: tweetbody},  function(error, tweet, response) {
				message.channel.sendMessage('Sucessfully tweeted:"' + tweetbody + '" to: https://twitter.com/OverSwiss')
			})
		} else {
			message.channel.sendMessage("Your tweet is longer than 140 letters. Pls shorten your tweet.")
		}
	}
})


/*
## EXP CURVE ########################
EQUASIONS
x = 1 * (3 ^ y)
y = log(x/1) / log(3)
DEFINITION
x = exp
y = lvl
COMMANDS
.eval Math.log(EXP / 10) / Math.log(1.5)
.eval 10 * Math.pow(1.5, LVL)
### END CURVE #######################

## MESSSAGE TEMPLATE ################
let m = "```xl\n"
m+= `"|---------"---------|"\n`
m+= ` > \n`
m+= ` > \n`
m+= `"|-------------------|"`
m+= "```"
## END MESSAGE TEMPLATE #############
*/

//-----------------------------------
// RPG
//-----------------------------------

bot.on('message', message => {
	if (message.author.id === bot.user.id) return

	if (message.content === '-create' || message.content === '-crt'){
		if (!db[message.author.id]) {
			db[message.author.id] = newuser
			jsonfile.writeFile(dbpath, db)
			message.channel.sendMessage("New profile created!")
			console.log ('new profile created!')
		} else {
			message.channel.sendMessage('You already have a profile.');
		}
	}

	if (message.content === '-rpg') {
		let m = "```xl\n"
		m+= `"|---------RPG HELP---------|"\n`
		m+= ` > welcome to the Overwatch RPG\n`
		m+= ` > this is the help page\n`
		m+= ` > \n`
		m+= ` > Commands:\n`
		m+= ` > -create, -crt "start your adventure!"\n`
		m+= ` > -profile, -prf "checks your profile"\n`
		m+= ` > -inventory, -inv "shows your inventory"\n`
		m+= ` > -daily, -dly "collect your daily rewards"\n`
		m+= ` > -charakter, -char "choose your charakter"\n`
		m+= ` > \n`
		m+= ` > Infos:\n`
		m+= ` > daily reset is everyday at 12:00 UTC+01:00\n`
		m+= `"|--------------------------|"`
		m+= "```"
		message.channel.sendMessage(m)
	}
})

bot.on('message', message => {
	if (message.author.id === bot.user.id) return

		// HARD RESET (TESTING ONLY)
		if (message.content === '-reset' && message.author.id === '64438454750031872' || message.content.startsWith('-reset') && message.author.id === '148764744231157760'){
			for(i in db){
				db[i].daily = 0
			}
			message.channel.sendMessage("daily reset!")
		}

		// FREE EXP (TESTING ONLY)
		if (message.content === '-freeexp' && message.author.id === '64438454750031872' || message.content.startsWith('-freeexp') && message.author.id === '148764744231157760'){
			let dailyexp = rand(100, 1000)
			db[message.author.id].exp += dailyexp
			message.channel.sendMessage(`added ${dailyexp} exp`)
		}

		// DAILY
		if (message.content === '-daily' || message.content === '-dly'){
			if (db[message.author.id].daily === 0) {
				let dailyexp = rand(100, 1000)
				let dailycredits = rand(100, 1000)
				db[message.author.id].exp += dailyexp
				db[message.author.id].credits += dailycredits
				db[message.author.id].daily = 1
				jsonfile.writeFile(dbpath, db)
				let m = "```xl\n"
				m+= `"|---------Daily reward!---------|"\n`
				m+= ` > Credits: +${dailycredits}\n`
				m+= ` > Exp: +${dailyexp}\n`
				m+= `"|-------------------------------|"`
				m+= "```"
				message.channel.sendMessage(m)
			} else {
				message.channel.sendMessage("You already collected your dailies!")
			}
		}

		// SHOW INVENTORY
		if (message.content === '-inventory' || message.content === '-inv' ){
			let m = '```xl\n'
			m += `"|---------INVENTORY---------|"\n`
			for(i in db[message.author.id].inventory){
				m += ` > `
				m += db[message.author.id].inventory[i]
				m += `\n`
			}
			m += '"|---------------------------|"```'
			message.channel.sendMessage(m)
		}

		// SHOW CURRENT PROFILE
		if (message.content === '-profile' || message.content === '-prf'){
			let crd = db[message.author.id].credits
			let exp = db[message.author.id].exp
			let lvl = Math.trunc(Math.log(exp / 1) / Math.log(3));
			let ncls = db[message.author.id].class
			let m = "```xl\n"
			m+= `"|---------PROFILE---------|"\n`
			m+= ` > Class: ${ncls}\n`
			m+= ` > Level: ${lvl}\n`
			m+= ` > Credits: ${crd}\n`
			m+= ` > Exp: ${exp}\n`

			m+= `"|-------------------------|"`
			m+= "```"
			message.channel.sendMessage(m)
		}

		// SHOW CURRENT PROFILE
		if (message.content === '-class' || message.content === '-cls'){
			profilecheck(message)
			let m = "```xl\n"
			m+= `"|---------CLASS---------|"\n`
			m+= ` > availiable classes:\n`
			m+= ` > Tank      // Low Damage,  High Health. Bonus: Armor\n`
			m+= ` > Offensive // High Damage, Mid Health.  Bonus: Damage\n`
			m+= ` > Defensive // Mid Damage,  Mid Health.  Bonus: Special Skills\n`
			m+= ` > Support   // Low Damage,  Mid Health.  Bonus: Evasion, Healing\n`
			m+= ` > Sniper    // High Damage, Low Health.  Bonus: Long Range\n`
			m+= ` > Builder   // Low Damage,  Mid Health.  Bonus: Build skill\n`
			m+= ` > \n`
			m+= ` > type "-class <your class>" to choose your class.\n`
			m+= ` > you can choose your class only Once!\n`
			m+= `"|-------------------------|"`
			m+= "```"
			message.channel.sendMessage(m)
		}

		if (message.content.startsWith('-class') && message.content.slice(7) in cls){
			if (!db[message.author.id].class === "none") {
				message.channel.sendMessage(`you selected class ${message.content.slice(7)}`)
				db[message.author.id].class = message.content.slice(7)
				jsonfile.writeFile(dbpath, db)
			} else {
				message.channel.sendMessage("You already choose your class.")
			}
		}



		// CREATE NEW PROFILE


		/*if (message.content.startsWith("-char") || message.content.startsWith("-charakter") && message.content.slice(6) in ) {

	}*/
})

bot.login(cred.bottoken)
console.log ('login √')
console.log ('Last save: ' + fs.statSync(botpath).mtime)
