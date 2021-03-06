const Discord = require('discord.js');
const bot = new Discord.Client();
const fetch = require('node-fetch')


bot.on('ready', () => {
    console.log('Bolt is ready!');
});

function today() {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    return yyyy + mm + dd;
}

function urlifyCmd(args) {
    const utterance = args.join(' ').replace(/\s/g, '%20');
    return utterance;
}

function notPlural(str) {
    if (str.endsWith('s')) {
        return str.slice(0, -1);
    }
    if (str.endsWith('es')) {
        return str.slice(0, -2);
    }
	return str;
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
        console.log('I am not trained to handle personaly targeted messages');
        return;
    }

    if (!msg.content.startsWith(cmdPrefix)) {
        return
    }

    // Slices off prefix from our message, then trims extra whitespace,
    // then returns our array of words from the message
    const args = msg.content.slice(cmdPrefix.length).trim().split(' ')

    //splits off the first word from the array, which will be our command
    const command = args.shift().toLowerCase()

    //Log the command and arguments passed with a command
    console.log(`command: ${command}, args: ${args}`)

    if (command === 'help') {
        msg.reply(`Available commands:
  ping - pong
  !hola - greetings
  !joke - greetings
  !leql - ask me anything you want to search for
Thanks`)
    }


    if (command === 'hola') {
        msg.reply('hola amigo')
        return
    }

    if (command === 'joke') {
        let getJoke = async () => {
            let result =
                await fetch('https://official-joke-api.appspot.com/random_joke')
            let json = await result.json()
            return json
        }

        let joke = await getJoke()

        msg.reply(`
Here's your joke:

      ${joke.setup}

      ${joke.punchline}`)
        return
    }


    if (command === 'leql') {
        const witUrl =
            `https://api.wit.ai/message?v=${today()}&q=${urlifyCmd(args)}`;
        console.log(witUrl)
        let getIntent = async () => {
            return await fetch(witUrl, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${process.env.WIT_BEARER}`
                    }
                })
                .then(resp => resp.json())
                .then(json => {
                    if (json.error && json.error.message) {
                        console.log(`ERROR: ${json.error.message}`);
                        throw new Error(json.error.message);
                    }
                    return json;
                });
        }

        let witResp = await getIntent()
        console.log(JSON.stringify(witResp));
		if (witResp.intents.length == 0) {
            msg.reply(
`One day I'll know how to translate [${urlifyCmd(args)}] into leql,
but now you could try where(/.*/)`);
			return
		}

        const intent = witResp.intents[0];
        switch (intent.name) {
            case 'leql_search': {
                console.log('LEQL Search');
                const key = notPlural(witResp.entities['key:key'][0].body);
                msg.reply(`where(${key})`);
                return;
            }
            case 'leql_group': {
                console.log('LEQL Groupby');
                const key = notPlural(witResp.entities['key:key'][0].body);
                msg.reply(`where(${key}) groupby(${key})`);
                return;
            }
            case "leql_calculate": {
                console.log('LEQL Calculate');
                const key = notPlural(witResp.entities['key:key'][0].body);
                msg.reply(`where(${key}) calculate(count)`);
                return;
            }
            default:
                console.log(`UNKNOWN INTENT: ${intent.name}`);
                msg.reply(`One day I'll know how to handle [${intent.name}] intent.
Now you could try where(/.*/)`);
                break;
        }
        return
    }
});


bot.login(process.env.BOT_TOKEN);
