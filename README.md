# Discord Reminders Bot [![Maintainability](https://api.codeclimate.com/v1/badges/ec4001a1c49ca96af0c0/maintainability)](https://codeclimate.com/github/jnhallquist/discord-reminders-bot/maintainability) [![CircleCI](https://circleci.com/gh/jnhallquist/discord-reminders-bot.svg?style=svg)](https://circleci.com/gh/jnhallquist/discord-reminders-bot)
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
 - Clone repo
 - `npm install`
 - `cp ./api/.keys.json ./api/keys.json`
 - Change secrets in `keys.json` to your own
 - `npm start`

## Testing
To run the tests, a local Redis server must be running.
