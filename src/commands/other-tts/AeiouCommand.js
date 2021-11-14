/* eslint-disable max-statements */
const { Command } = require('@greencoast/discord.js-extended');
const logger = require('@greencoast/logger');
const AeiouProvider = require('../../classes/tts/providers/AeiouProvider');

class AeiouCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'aeiou',
      aliases: ['moonbase'],
      description: 'Gửi tin nhắn TTS aeiou (tương tự như Moonbase Alpha) trong kênh thoại của bạn.',
      emoji: ':robot:',
      group: 'other-tts',
      guildOnly: true
    });
  }

  run(message, args) {
    const { channel } = message.member.voice;
    const { ttsPlayer, name: guildName, voice } = message.guild;
    const connection = voice ? voice.connection : null;

    if (!channel) {
      return message.reply('bạn cần trong một kênh thoại trước.');
    }

    if (args.length < 1) {
      return message.reply('bạn cần nhập một nội dung muốn nói.');
    }

    if (connection) {
      if (voice.channel !== channel) {
        return message.reply('bạn cần phải ở trong cùng một kênh thoại với tôi.');
      }

      return ttsPlayer.say(args.join(' '), AeiouProvider.NAME);
    }

    if (!channel.viewable) {
      return message.reply('Tôi không thể nhìn thấy kênh thoại của bạn.');
    }

    if (!channel.joinable) {
      return message.reply('Tôi không thể tham gia kênh thoại của bạn.');
    }

    if (!channel.speakable) {
      return message.reply('Tôi không thể nói trong kênh thoại của bạn.');
    }

    if (channel.full) {
      return message.reply('Kênh thoại của bạn đã đầy.');
    }

    return channel.join()
      .then(() => {
        logger.info(`Đã tham gia ${channel.name} trong ${guildName}.`);
        message.channel.send(`Đã tham gia ${channel}.`);
        return ttsPlayer.say(args.join(' '), AeiouProvider.NAME);
      });
  }
}

module.exports = AeiouCommand;
