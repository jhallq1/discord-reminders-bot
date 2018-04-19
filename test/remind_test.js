// process.env.TZ = 'UTC';
//
// require('./helpers/redisHelpers.js');
//
// const proxyquire = require('proxyquire').noPreserveCache().noCallThru();
// const { expect } = require('chai');
// const msg        = require('./stubs/message.js');
// const exceptions = require('../api/util/exceptions.json');
// const tzStore   = require('./helpers/fakeRedis.js').timezones;
// const reminderStore = require('./helpers/fakeRedis.js').reminders;
// const addJob     = require('./stubs/addToQueue.js');
//
// /* eslint-disable global-require */
// const RemindCommand = proxyquire(
//   '../api/commands/reminders/remind.js',
//   {
//     'discord.js-commando': require('./stubs/Command.js'),
//     '../../redis/client.js': tzStore,
//     '../../bot.js': new (require('./stubs/CommandoClient.js').CommandoClient)()
//   }
// );
// /* eslint-enable global-require */
//
// function subject(message, target, content, datetime) {
//   return new RemindCommand({}).run(
//     message, { target, content, datetime }
//   );
// }
//
// function roundTimestampToDay(milliseconds) {
//   return Math.round(milliseconds / (10 ** 5)) * (10 ** 5);
// }
//
// describe('#run', () => {
//   const content = 'Hello World!';
//   const target  = {
//     id: 1,
//     username: 'test_user',
//     discriminator: '1234'
//   };
//
//   describe('time parsing', () => {
//     const unparsableTime = 'hello';
//     const pastTime       = 'yesterday at noon';
//
//     context('when date format is incorrect', () => {
//       it('throws invalid format exception', () => subject(
//         msg, target, content, unparsableTime
//       ).catch((ex) => {
//         expect(ex).to.eq(exceptions.invalid_datetime_format);
//       }));
//     });
//
//     context('when timezone is not set', () => {
//       it('throws invalid timezone exception', () => subject(
//         msg, target, content, pastTime
//       ).catch((ex) => {
//         expect(ex).to.eq(exceptions.timezone_not_set);
//       }));
//     });
//     //
//     // context('when date is in the past', () => {
//     //   it('throws date in past exception', () => insertTz(
//     //     [target.username, target.discriminator, 'America/Los_Angeles']
//     //   )
//     //   .then(() => subject(msg, target, content, pastTime))
//     //   .catch((ex) => {
//     //     expect(ex).to.eq(exceptions.past_time);
//     //   }));
//     // });
//   });
//
//   // describe('message timezone', () => {
//   //   const reminderTime = 'in 24 hours';
//   //   const delay        = 8.64 * (10 ** 7);
//   //
//   //   context('same as server', () => {
//   //     it('adds twenty-four hours to the server time', () => insertTz(
//   //       [target.username, target.discriminator, 'UTC']
//   //     )
//   //     .then(() => subject(msg, target, content, reminderTime))
//   //     .then(() => {
//   //       expect(roundTimestampToDay(jobQueue.delayInMilliseconds))
//   //       .to.eq(delay);
//   //     }));
//   //   });
//   //
//   //   context('behind server', () => {
//   //     const timezone = 'America/Los_Angeles';
//   //
//   //     it('adds twenty-four hours to the server time', () => insertTz(
//   //       [target.username, target.discriminator, timezone]
//   //     )
//   //     .then(() => subject(msg, target, content, reminderTime))
//   //     .then(() => {
//   //       expect(roundTimestampToDay(jobQueue.delayInMilliseconds))
//   //       .to.eq(delay);
//   //     }));
//   //   });
//   //
//   //   context('ahead of server', () => {
//   //     const offset = 'Asia/Tokyo';
//   //
//   //     it('adds twenty-four hours to the server time', () => insertTz(
//   //       [target.username, target.discriminator, offset]
//   //     )
//   //     .then(() => subject(msg, target, content, reminderTime))
//   //     .then(() => {
//   //       expect(roundTimestampToDay(jobQueue.delayInMilliseconds))
//   //       .to.eq(delay);
//   //     }));
//   //   });
//   // });
// });
