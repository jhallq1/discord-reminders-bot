# Discord Reminders Bot
This is a bot for use with the [Discord](https://discordapp.com/) voice and
text chat platform. When added to a Discord server, users will be able to set
and receive reminders.

This bot uses an NLP engine to parse the date and time of reminder requests.
Unfortunately, this engine may not parse the dates/times with 100% accuracy.
I will be working on improving the NLP in future releases.

Additionally, the user's abilities to modify and cancel reminders are
currently in development. Thank you for your patience.

## Features
- [x] Set and receive reminders for self or other users
- [ ] View reminders one has set for self or others
- [ ] Modify set reminders
- [ ] Cancel set reminders
- [ ] Receive notification when reminder task is completed

## Setup
 - Clone repo
 - `npm install`
 - `cp ~/api/.keys.json ~/api/keys.json`
 - Change secrets in `keys.json` to your own
 - `npm start`

## Testing
To run the tests, a local Redis server must be running.
