const { Command } = require('@greencoast/discord.js-extended');
const logger = require('@greencoast/logger');
const { GoogleProviderError } = require('../../errors');

class LangCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'lang',
      description: 'Thay đổi ngôn ngữ TTS.',
      emoji: ':map:',
      group: 'google-tts',
      guildOnly: true
    });
  }

  run(message, args) {
    let [newLang] = args;
    const { googleProvider } = message.guild.ttsPlayer;

    if (!newLang) {
      return message.reply(`để thiết lập ngôn ngữ TTS, hãy chạy: **${this.client.prefix}lang <mã ngôn ngữ>**
      Để xem danh sách các mã ngôn ngữ có sẵn, hãy chạy: **${this.client.prefix}langs**.
      Ngôn ngữ hiện tại được đặt thành: **${googleProvider.getLang()}**.`);
    }

    newLang = newLang.toString().toLowerCase();

    try {
      const setLang = googleProvider.setLang(newLang);
      logger.info(`Máy chủ ${message.guild.name} đã thay đổi ngôn ngữ thành ${googleProvider.getLang()}.`);
      return message.reply(`ngôn ngữ đã được đặt thành **${setLang}**.`);
    } catch (error) {
      if (error instanceof GoogleProviderError) {
        if (error.reason === GoogleProviderError.REASON.invalid) {
          return message.reply(`ngôn ngữ không hợp lệ. Nhập **${this.client.prefix}langs** để biết danh sách các ngôn ngữ có sẵn.`);
        } else if (error.reason === GoogleProviderError.REASON.same) {
          return message.reply(`ngôn ngữ đã được đặt thành **${googleProvider.getLang()}**.`);
        }

        throw error;
      }

      throw error;
    }
  }
}

module.exports = LangCommand;
