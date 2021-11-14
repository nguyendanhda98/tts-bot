const { Command } = require('@greencoast/discord.js-extended');
const logger = require('@greencoast/logger');

class StopCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'stop',
      aliases: ['leave'],
      description: 'Dừng bot TTS và rời khỏi kênh thoại.',
      emoji: ':x:',
      group: 'all-tts',
      guildOnly: true
    });
  }

  run(message) {
    const { ttsPlayer, voice, name: guildName } = message.guild;
    const connection = voice ? voice.connection : null;
    const channel = voice ? voice.channel : null;
    const { channel: memberChannel } = message.member.voice;

    if (!connection) {
      return message.reply("Tôi không ở trong kênh thoại.");
    }

    if (!memberChannel || channel !== memberChannel) {
      return message.reply('bạn cần phải ở trong cùng kênh thoại với tôi để sử dụng lệnh này.');
    }

    ttsPlayer.stop();
    logger.info(`Đã rời khỏi kênh thoại thành công ${channel.name} từ máy chủ ${guildName}`);
    return message.channel.send(`Đã rời khỏi kênh thoại thành công ${channel}.`);
  }
}

module.exports = StopCommand;
