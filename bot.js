const Discord = require('discord.js');
const bot = new Discord.Client();
const auth = require('./auth.json');

const globalCooldown = 30000;

const botChannelID = '635660555457134603';

const commands = {
    // Other commands
    '!halp': {'audio' : null, 'desc' : 'A list of available commands.'},
    '!stahp': {'audio' : null, 'desc' : 'Stops the current command.'},
    // Sound commands
    '!x' : {'audio' : 'i_need_healing.mp3', 'desc' : 'Genji saying "I need healing".'},
    '!trololo' : {'audio' : 'trololo.mp3', 'desc' : 'A lovely song by Eduard Khil.'},
    '!yes' : {'audio' : 'bison_yes_yes.mp3', 'desc' : 'Bison\'s catchphrase.'},
};

const errors = {
    'cooldown': 'Squawk! The PeliBot is busy eating fish at the moment (' + (globalCooldown/1000)  + ' seconds cooldown).',
    'not_a_command': 'Squawk! This command is invalid. Use \'!halp\' for a list of available commands.',
    'not_in_a_channel': 'Squawk! You need to be in a voice channel for the PeliBot to grace you with its presence.'
};

var isReady = true;

function startCooldown (cooldown = globalCooldown) {
    if (isReady) isReady = false;
    setTimeout(function(){
        isReady = true;
    }, cooldown);
}

function checkCooldown(channel) {
    if (!isReady) {
        channel.send(errors['cooldown']);
    }

    return isReady;
}

bot.on('message', message => {

    var command = message.content;
    var textChannel = message.channel;
    var voiceChannel = message.member.voiceChannel;

    // Check if message is from PeliBot Channel
    if (textChannel.id !== botChannelID) return;

    // Check if message is an intended command and not from a bot
    if (command.charAt(0) !== '!' || message.author.bot) return;

    // Handle commands without audio
    if (command === '!halp') {

        var messageToSend = 'Squawk! Here is a list of my available commands: \n';

        for (var cmd in commands) {
            messageToSend += '"' + cmd + '": ' + commands[cmd].desc + ' \n';
        }

        message.channel.send(messageToSend);
        return;

    }

    if (command === '!stahp') {
        voiceChannel.leave();
        return;
    }

    // Not a valid command
    if (!(command in commands)) {
        var errorMessage = errors['not_a_command'];
        message.channel.send(errorMessage);
        isReady = true;
        return;
    }

    // Check cooldown
    if (!checkCooldown(textChannel)) return;

    // Commands with audio
    isReady = false;

    var audioFile = commands[command].audio;
    var voiceChannel = message.member.voiceChannel;

    // Not in a voice channel
    if (typeof voiceChannel === 'undefined') {
        var errorMessage = errors['not_in_a_channel'];
        message.channel.send(errorMessage);
        isReady = true;
        return;
    }

    voiceChannel.join().then(connection =>
    {
        const dispatcher = connection.playFile('./assets/sounds/' + audioFile, {});
        dispatcher.on("end", end => {
            voiceChannel.leave();
        });
    }).catch(err => console.log(err));
    startCooldown();

});

bot.login(auth.token);