const { Client, MessageEmbed, MessageReaction } = require('discord.js');
const bot = new Client();
require('dotenv').config();

const TOKEN = process.env.TOKEN;

emojiLetters = ['🅰', '🅱', '🅲'];

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}`);
  console.log(bot.user.presence.status);
});

// roll dice x sides
const rollDice = (sides) => Math.floor(Math.random() * sides) + 1;

bot.on('message', async (message) => {
  const messageContent = message.content;
  const messageWords = message.content.split(' ');
  console.log('messageWords: ' + messageWords);
  const rollFlavor = messageWords.slice(2).join(' ');
  console.log('rollFlavor: ' + rollFlavor);

  // Dice
  if (messageWords[0] === '!roll') {
    if (messageWords.length === 1) {
      // !roll
      const sides = 6;
      return await message.reply(rollDice(sides) + ' ' + rollFlavor);
    }
    // !roll 20
    let sides = messageWords[1];
    let rolls = 1;

    if (!isNaN(messageWords[1][0] / 1) && messageWords[1].includes('d')) {
      // !roll 2d20
      rolls = messageWords[1].split('d')[0] / 1;
      sides = messageWords[1].split('d')[1];
    } else if (messageWords[1][0] == 'd') {
      // !roll d20
      sides = sides.slice(1);
    }
    sides = sides / 1;
    if (rolls > 1) {
      const rollResults = [];
      for (let i = 0; i < rolls; i++) {
        rollResults.push(rollDice(sides));
      }

      const sum = rollResults.reduce((a, b) => a + b);
      return await message.reply(
        `Rolled: [ ${rollResults
          .toString()
          .replace(/,/g, ' + ')} ] ${rollFlavor} = ${sum}`
      );
    } else {
      return await message.reply(rollDice(sides) + ' ' + rollFlavor);
    }
  }

  // !poll "title" [option1] [option2] [option3]
  if (messageWords[0] === '!poll') {
    const startTitle = messageContent.indexOf('{');
    const endTitle = messageContent.indexOf('}');
    const pollTitle = messageContent.substring(startTitle + 1, endTitle - 1);

    const regx = /\[(.*?)\]/g;
    const options = [];
    let found;

    while ((found = regx.exec(messageContent))) {
      options.push(found[1]);
    }

    console.log('options: ' + options);

    const string = options.join(' ');

    console.log('pollTitle: ' + pollTitle);
    console.log('string options: ' + string);

    // pollMessage = '';
    // let i = 0;

    // TODO agregar reaccion emojis
    // for (choice in options) {
    //   if (!(options[i] == '')) {
    //     if (options.length > 11) {
    //       await message.channel.send('Maximum of 10 options');
    //     } else if (!(i == options.length - 1)) {
    //       pollMessage = pollMessage + '\n\n' + emojiLetters[i] + ' ' + choice;
    //     }
    //     i++;
    //   }
    // }

    // const e = new MessageEmbed()
    //   .setTitle('**' + pollTitle + '**')
    //   .setDescription(pollMessage)
    //   .setColor(0x83bae3);
    // pollMessage = await message.channel.send((embed = e));
    // finalOptions = [];
    // for (choice in options) {
    //   if (!(i == options.length - 1) && !(options[i] == '')) {
    //     finalOptions.push(choice);
    //     await pollMessage.react(emojiLetters[i]);
    //     i++;
    //   }
    // }
  }

  // !help
  if (messageWords[0] === '!help') {
    const embed = new MessageEmbed()
      .setTitle('Roll Dice')
      .setDescription('!roll [default 6] \n!roll 2d20');
    return await message.author.send(embed);
  }
});

bot.login(TOKEN);
