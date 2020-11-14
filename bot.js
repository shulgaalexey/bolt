const Discord = require('discord.js');
const bot = new Discord.Client();


bot.on('ready', () => {
	console.log('Bolt is ready!');
});


const cmdPrefix = '!'

bot.on('message', async msg => {
	if (msg.content === 'ping') {
		msg.reply('pong');
		return;
    	}

	/*if(!msg.content.startsWith(cmdPrefix)) {
		msg.reply('IDK WTF is: ' + msg.content)
		return
	}*/

	// slices off prefix from our message, then trims extra whitespace,
	// then returns our array of words from the message
	const args = msg.content.slice(cmdPrefix.length).trim().split(' ')

	//splits off the first word from the array, which will be our command
	const command = args.shift().toLowerCase()

	//log the command
	console.log('command: ', command)

	//log any arguments passed with a command
	console.log(args)
	
	if (comand === 'ok') {
		msg.reply('ok')
	}

	if (command === 'hola') {
		msg.reply('hola amigo')
		return
	}

	//msg.reply('Unknown command: ' + command)
});


bot.login(process.env.BOT_TOKEN);
