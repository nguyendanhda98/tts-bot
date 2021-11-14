const { Command } = require('@greencoast/discord.js-extended');
const { MessageEmbed } = require('discord.js');
const { MESSAGE_EMBED } = require('../../common/constants');
const { splitContentForEmbedFields } = require('../../common/utils');
const languages = require('../../../data/languages.json');

class LangsCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'langs',
      description: 'Hiển thị danh sách các ngôn ngữ được hỗ trợ.',
      emoji: ':page_facing_up:',
      group: 'google-tts',
      guildOnly: true
    });

    this.langsEmbed = this.createEmbed();
  }

  createEmbed() {
    const embed = new MessageEmbed()
      .setTitle('Danh sách các ngôn ngữ được hỗ trợ:')
      .setColor(MESSAGE_EMBED.color)
      .setDescription(`Đây là danh sách đầy đủ của tất cả các ngôn ngữ được hỗ trợ bởi bot TTS này. 
    
      Để thay đổi ngôn ngữ, hãy sử dụng **${this.client.prefix}lang <mã ngôn ngữ>**.`)
      .setThumbnail(MESSAGE_EMBED.langThumbnail)
      .setURL(MESSAGE_EMBED.langURL);

    const content = this.sortedLanguageKeys().map((key) => {
      const cur = languages[key];
      return `${cur.emoji} ${cur.name} - '**${this.client.prefix}lang ${key}**'\n`;
    });
    const splitContent = splitContentForEmbedFields(content);

    splitContent.forEach((field, index) => {
      embed.addField(`Trang ${index + 1}:`, field);
    });

    return embed;
  }

  sortedLanguageKeys() {
    return Object.keys(languages).sort((a, b) => {
      return languages[a].name.localeCompare(languages[b].name);
    });
  }

  run(message) {
    return message.channel.send(this.langsEmbed);
  }
}

module.exports = LangsCommand;
