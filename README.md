# Discord Reminders Bot
This is a bot for use with the [Discord](https://discordapp.com/) voice and
text chat platform. When added to a Discord server, users will be able to set
and receive reminders.

## Features
- [x] Set and receive reminders for self or other users
- [ ] View reminders one has set for self or others
- [ ] Modify set reminders
- [ ] Cancel set reminders
- [ ] Receive notification when reminder task is completed

## Setup
 - Clone Repo
 - `npm install`
 - `cp ~/api/.keys.json ~/api/keys.json`
 - Change secrest in `keys.json` to your own
 - `npm start`

## Dependencies
* [Node.js](https://nodejs.org/): version 8.0.0 or newer
* [Discord.js](https://discord.js.org): node.js module that provides access
to the Discord API
* [Commando](https://github.com/Gawdl3y/discord.js-commando): framework that,
in conjunction with discord.js, allows for command creation
* [Kue](https://github.com/Automattic/kue): Redis-backed job queue
* [Chrono](https://github.com/wanasit/chrono): natural language date parser
