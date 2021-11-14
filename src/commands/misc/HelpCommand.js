const { Command } = require('@greencoast/discord.js-extended');
const { MessageEmbed } = require('discord.js');
const { MESSAGE_EMBED } = require('../../common/constants');

class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'help',
      aliases: ['h'],
      description: 'Hiển thị thông báo trợ giúp với tất cả các lệnh có sẵn.',
      emoji: ':question:',
      group: 'misc',
      guildOnly: true
    });
  }

  prepareFields() {
    return this.client.registry.groups.map((group) => {
      const listOfCommands = group.commands.reduce((text, command) => {
        return text.concat(`${command.emoji} **${this.client.prefix}${command.name}** - ${command.description}\n`);
      }, '');

      return { title: group.name, text: listOfCommands };
    });
  }

  run(message) {
    const fields = this.prepareFields();
    const embed = new MessageEmbed()
      .setTitle('Thông báo trợ giúp chuyển văn bản thành giọng nói')
      .setColor(MESSAGE_EMBED.color)
      .setThumbnail(MESSAGE_EMBED.helpThumbnail);

    for (const key in fields) {
      const field = fields[key];
      embed.addField(field.title, field.text);
    }

    embed.addField('Phát hiện một lỗi?', `Bot này vẫn có thể xảy ra lỗi, vì vậy trong trường hợp bạn tìm thấy một lỗi, vui lòng báo cáo nó trong bot này [**GitHub Issues Page**](${MESSAGE_EMBED.helpURL}).`);

    return message.channel.send(embed);
  }
}

module.exports = HelpCommand;
