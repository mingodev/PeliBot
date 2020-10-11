const Discord = require('discord.js');
const bot = new Discord.Client();
const auth = require('./auth.json');

const config = require('./config');

const globalCooldown = config.cooldown;

const botTextChannelID = '635660555457134603';

let _connection = undefined

const commands = require('./commands')

const errors = {
  cooldown:
    'Squawk! The PeliBot is busy eating fish at the moment (' +
    globalCooldown / 1000 +
    ' seconds cooldown).',
  not_a_command:
    'Squawk! This command is invalid. Use \'!halp\' for a list of available commands.',
  not_in_a_channel:
    'Squawk! You need to be in a voice channel for the PeliBot to grace you with its presence.',
  not_in_voice_channel: 'Squawk! You can\'t stop me!',
};

var isReady = true;

function startCooldown(cooldown = globalCooldown) {
  if (isReady) isReady = false;
  setTimeout(function() {
    isReady = true;
  }, cooldown);
}

function checkCooldown(channel) {
  if (!isReady) channel.send(errors['cooldown']);
  return isReady;
}

function returnToNest() {
  // Since we can't keep track of the bot's current channel, we join a given channel and leave it.
  // We can make the channel private to make sure users don't get to hear alerts when the bot joins and leaves the channel.

  _connection.disconnect()
  /*let channel = bot.channels.get(botVoiceChannelID);
  channel.join().then(console.log).catch(console.error);
  channel.leave().then(console.log).catch(console.error);*/
}

bot.on('message', message => {
  // Check if message is a DM
  if (message.guild === null) return;

  let command = message.content;
  let textChannel = message.channel;
  let voiceChannel = message.member.voice.channel;

  // Check if message is from PeliBot Channel
  if (textChannel.id !== botTextChannelID) return;

  // Check if message is an intended command and not from a bot
  if (command.charAt(0) !== '!' || message.author.bot) return;

  // Handle commands without audio
  if (command === '!halp') {
    let messageToSend = 'Squawk! Here is a list of my available commands: \n';

    for (let command in commands) {
      let cmd = commands[command];
      if (!cmd.hasOwnProperty('secret'))
        messageToSend += command + ' : ' + cmd.desc + ' \n';
    }

    message.channel.send(messageToSend);
    return;
  }

  if (command === '!stahp' && typeof voiceChannel !== 'undefined') {
    returnToNest();
    return;
  } else if (command === '!sthap' && typeof voiceChannel === 'undefined') {
    let errorMessage = errors['not_in_voice_channel'];
    message.channel.send(errorMessage);
    return;
  }

  if (command === '!rng') {
    let roulette = [];
    for (let command in commands) {
      let cmd = commands[command];
      if (cmd.audio !== null) roulette.push(command);
    }
    if (roulette.length > 0)
      command = roulette[Math.floor(Math.random() * roulette.length)];
  }

  // Not a valid command
  if (!(command in commands)) {
    let errorMessage = errors['not_a_command'];
    message.channel.send(errorMessage);
    return;
  }

  // Not in a voice channel
  if (typeof voiceChannel === 'undefined') {
    let errorMessage = errors['not_in_a_channel'];
    message.channel.send(errorMessage);
    return;
  }

  // Check cooldown
  if (!checkCooldown(textChannel)) return;

  // Commands with audio
  isReady = false;

  let cmd = commands[command];
  let audioFile = cmd.audio;
  let audioVolume = cmd.volume !== 'undefined' ? commands[command].volume : 1;

  voiceChannel
    .join()
    .then(connection => {
      startCooldown();
      _connection = connection;

      const dispatcher = connection.play('./assets/sounds/' + audioFile, {
        volume: audioVolume
      });
      dispatcher.on('finish', end => {
        returnToNest();
      });
    })
    .catch(err => console.log(err));
});

bot.login(auth.token);
