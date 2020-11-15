const Discord = require('discord.js');
const bot = new Discord.Client();
const fetch = require('node-fetch')


bot.on('ready', () => {
	console.log('Bolt is ready!');
});


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


	if(command === 'ask') {
		//let witUrl = "curl -H "
		//+ "'Authorization: Bearer " + process.env.WIT_BEARER + "' "
		//+ "'https://api.wit.ai/message?v=20201115&q=order%20me%20some%20wine'";

		//let witUrl = 'https://api.wit.ai/message?v=20201115&q=order%20me%20some%20wine';
		let utterance = args.join(' ').replace(/\s/g, '%20')
		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
		var yyyy = today.getFullYear();
		today = yyyy + mm  + dd;
		let witUrl = 'https://api.wit.ai/message?v=' + today + '&q=' + utterance;
		console.log(witUrl)
		let getIntent = async () => {
			return await fetch(witUrl, {
				method: "GET",
				headers: {"Authorization": "Bearer " + process.env.WIT_BEARER}
			})
			.then(resp => resp.json())
			.then(json => {
				console.log(json)
				if (json.error && json.error.message) {
					console.log("ERROR");
					throw new Error(json.error.message);
				}
				return json;
			});
			//let json = await result.json()
			//return json
		}

		let witResp = await getIntent()
		console.log(witResp)
		console.log(JSON.stringify(witResp));
		const intent = witResp.intents.length > 0 && witResp.intents[0];
		switch (intent.name) {
			case "ask_for_something":
				console.log("asking for something");
				msg.reply(intent.name + ' confidence: ' + intent.confidence)
				return;
			case "bring_thing":
				console.log("bringing a thing");
				msg.reply(intent.name + ' confidence: ' + intent.confidence)
				return;
			default:
				console.log("UNKNOWN INTENT: " + intent.name);
				break;
		}
		msg.reply(witResp.intents)
		return
	}


	//msg.reply('Unknown command: ' + command)
});


bot.login(process.env.BOT_TOKEN);
