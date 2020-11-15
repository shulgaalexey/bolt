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

	//msg.reply('Unknown command: ' + command)
});


bot.login(process.env.BOT_TOKEN);
