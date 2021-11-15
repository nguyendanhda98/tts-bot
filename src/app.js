const path = require('path');
const { Structures } = require('discord.js');
const { ExtendedClient, ConfigProvider } = require('@greencoast/discord.js-extended');
const TTSGuild = require('./classes/extensions/TTSGuild');

Structures.extend('Guild', TTSGuild);

const config = new ConfigProvider({
  configPath: path.join(__dirname, '../config/settings.json'),
  env: process.env,
  default: {
    PREFIX: '$',
    OWNER_ID: null,
    OWNER_REPORTING: false,
    PRESENCE_REFRESH_INTERVAL: 15 * 60 * 1000, // 15 Minutes
    PRESENCE_STATUS: null,
    PRESENCE_TYPE: null,
    DISCONNECT_TIMEOUT: 5 * 60 * 1000 // 5 Minutes
  },
  types: {
    TOKEN: 'string',
    PREFIX: 'string',
    OWNER_ID: ['string', 'null'],
    OWNER_REPORTING: 'boolean',
    PRESENCE_REFRESH_INTERVAL: ['number', 'null'],
    PRESENCE_STATUS: 'string',
    PRESENCE_TYPE: 'string',
    DISCONNECT_TIMEOUT: ['number', 'null']
  }
});

const client = new ExtendedClient({
  config,
  debug: process.argv.includes('--debug'),
  errorOwnerReporting: config.get('OWNER_REPORTING'),
  owner: config.get('OWNER_ID'),
  prefix: config.get('PREFIX'),
  presence: {
    status: config.get('PRESENCE_STATUS'),
    type: config.get('PRESENCE_TYPE'),
    refreshInterval: config.get('PRESENCE_REFRESH_INTERVAL'),
    templates: [
      '{num_guilds} máy chủ!',
      '{num_guilds} servers!',
      'Nhập "{prefix}help" để trợ giúp.',
      'Type "{prefix}help" to help.',
      'Nhập "{prefix}say" để nói.',
      'Type "{prefix}say" to say.',
      '{num_members} người dùng!',
      '{num_members} users!',
      '{uptime}.',
      'uptime for {uptime}.'
    ]
  }
});

client
  .registerDefaultEvents()
  .registerExtraDefaultEvents();

client.registry
  .registerGroups([
    ['google-tts', 'Google TTS Commands'],
    ['other-tts', 'Other TTS Commands'],
    ['all-tts', 'All TTS Commands'],
    ['misc', 'Miscellaneous Commands']
  ])
  .registerCommandsIn(path.join(__dirname, './commands'));

client.login(config.get('TOKEN'));
