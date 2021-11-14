/* eslint-disable max-statements */
const { Command } = require('@greencoast/discord.js-extended');
const logger = require('@greencoast/logger');
const GoogleProvider = require('../../classes/tts/providers/GoogleProvider');

class SayCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'say',
      aliases: ['tts', 's'],
      description: 'Gửi tin nhắn TTS trong kênh thoại của bạn.',
      emoji: ':speaking_head:',
      group: 'google-tts',
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

      return ttsPlayer.say(args.join(' '), GoogleProvider.NAME);
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
        return ttsPlayer.say(args.join(' '), GoogleProvider.NAME);
      });
  }
}

module.exports = SayCommand;
