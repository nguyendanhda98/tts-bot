const { Command } = require('@greencoast/discord.js-extended');
const logger = require('@greencoast/logger');
const { GoogleProviderError } = require('../../errors');

class SpeedCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'speed',
      description: 'Thay đổi tốc độ nói TTS (phải là **normal** đối với tốc độ bình thường hoặc **slow** đối với tốc độ chậm).',
      emoji: ':fast_forward:',
      group: 'google-tts',
      guildOnly: true
    });
  }

  run(message, args) {
    const [newSpeed] = args;
    const { googleProvider } = message.guild.ttsPlayer;

    if (!newSpeed) {
      return message.reply(`để thiết lập tốc độ TTS, hãy nhập: **${this.client.prefix}speed <tốc độ>** và thay thế *<tốc độ>* với một trong hai *normal* hoặc *slow*.`);
    }

    try {
      const setSpeed = googleProvider.setSpeed(newSpeed);
      logger.info(`Máy chủ ${message.guild.name} đã thay đổi tốc độ thành ${setSpeed}.`);
      return message.reply(`tốc độ nói đã được đặt thành: **${setSpeed}**`);
    } catch (error) {
      if (error instanceof GoogleProviderError) {
        if (error.reason === GoogleProviderError.REASON.invalid) {
          return message.reply('tốc độ không hợp lệ, nó phải là *normal* hoặc *slow*.');
        }

        throw error;
      }

      throw error;
    }
  }
}

module.exports = SpeedCommand;
