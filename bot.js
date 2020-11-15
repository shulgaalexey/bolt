const Discord = require('discord.js');
const bot = new Discord.Client();
const fetch = require('node-fetch')


bot.on('ready', () => {
	console.log('Bolt is ready!');
});

function today() {
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, '0');
	var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
	var yyyy = today.getFullYear();
	today = yyyy + mm  + dd;
	return today;
}

function urlifyCmd(args) {
	let utterance = args.join(' ').replace(/\s/g, '%20');
	return utterance;
}


const cmdPrefix = '!'

bot.on('message', async (msg) => {
	console.log('>>> ' + msg.content);

	if (msg.content === 'ping') {
		msg.reply('pong');
		return;
	}

	if (msg.content.startsWith('<@')) {
		// This is when a message starts with a user mention
		console.log('I am not trained to handle personal targeting messages');
		return;
	}

	if(!msg.content.startsWith(cmdPrefix)) {
		//msg.reply('IDK WTF is: ' + msg.content)
		return
	}

	// slices off prefix from our message, then trims extra whitespace,
	// then returns our array of words from the message
	const args = msg.content.slice(cmdPrefix.length).trim().split(' ')

	//splits off the first word from the array, which will be our command
	const command = args.shift().toLowerCase()

	//log the command
	console.log('command: ', command)

	//log any arguments passed with a command
	console.log(args)

	if (command === 'help') {
		msg.reply(`Available commands:
!ping - pong
!ok - ok
!hola - greetings
!joke - greetings
!ask - ask me anything on your natural language
Thanks`)
	}

	if (command === 'ok') {
		msg.reply('ok')
		return
	}

	if (command === 'hola') {
		msg.reply('hola amigo')
		return
	}

	if(command === 'joke') {
      let getJoke = async () => {
        let result =
			  await fetch('https://official-joke-api.appspot.com/random_joke')
        let json = await result.json()
        return json
      }

      let joke = await getJoke()

      msg.reply(`
      Here's your joke
      ${joke.setup}
      ${joke.punchline}
		  `)
      return
  }


	if(command === 'leql') {
		let witUrl = 'https://api.wit.ai/message?v=' + today()
			+ '&q=' + urlifyCmd(args);
		console.log(witUrl)
		let getIntent = async () => {
			return await fetch(witUrl, {
				method: 'GET',
				headers: {'Authorization': 'Bearer ' + process.env.WIT_BEARER}
			})
			.then(resp => resp.json())
			.then(json => {
				if (json.error && json.error.message) {
					console.log('ERROR: ' + json.error.message);
					throw new Error(json.error.message);
				}
				return json;
			});
		}

		let witResp = await getIntent()
		console.log(JSON.stringify(witResp));
		const intent = witResp.intents.length > 0 && witResp.intents[0];
		switch (intent.name) {
			case 'leql_search':
				console.log('LEQL Search');
				let key = witResp.entities.['key:key'][0].body;
				msg.reply('where(' + key + ')');
				return;
			case 'leql_group':
				console.log('LEQL Groupby');
				msg.reply('groupby(key)');
				return;
			case "leql_calculate":
				console.log('LEQL Calculate');
				msg.reply('calculate(key)');
				return;
			case 'ask_for_something':
				console.log('asking for something');
				msg.reply(intent.name + ' confidence: ' + intent.confidence)
				return;
			case 'bring_thing':
				console.log('bringing a thing');
				msg.reply(intent.name + ' confidence: ' + intent.confidence)
				return;
			default:
				console.log('UNKNOWN INTENT: ' + intent.name);
				break;
		}
		msg.reply(witResp.intents)
		return
	}


	//msg.reply('Unknown command: ' + command)
});


bot.login(process.env.BOT_TOKEN);
