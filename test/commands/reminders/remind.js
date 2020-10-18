/* global describe beforeEach afterEach context it */

require("../../helper.js");

const proxyquire = require("proxyquire").noCallThru();
const { expect } = require("chai");
const sinon = require("sinon");
const tzStore = require("../../../redis/client.js").timezones;
const reminderStore = require("../../../redis/client.js").reminders;
const msg = require("../../stubs/message.js");
const exceptions = require("../../../util/exceptions.json");

let parseDate = { parsed: "parsed", delayAmt: 600, timeInMS: 100 };

/* eslint-disable global-require */
const RemindCommand = proxyquire("../../../commands/reminders/remind.js", {
  "discord.js-commando": require("../../stubs/Command.js"),
  "../../bot.js": new (require("../../stubs/CommandoClient.js").CommandoClient)(),
  "../../../api/util/translateDatetime.js": () => parseDate
});
/* eslint-enable global-require */

const subject = async (message, content) => {
  try {
    const reminder = new RemindCommand({});
    await reminder.run(message, { content });
  } catch (error) {
    return error;
  }
};

describe("Remind Command", () => {
  const reminder = {
    target: {
      username: "test_user",
      id: "1234"
    },
    content: "This is a test reminder",
    datetime: "in 1 hour"
  };

  let dm;
  let reminders;
  let sandbox;
  let say;
  let tz;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    say = sandbox.stub(msg, "say");
    dm = sandbox.stub(msg, "direct");
    tz = sandbox.stub(tzStore, "getAsync").resolves("timezone");
    reminders = sandbox.stub(reminderStore, "getAsync").resolves([]);
  });

  afterEach(() => sandbox.restore());

  context("user does not have a timezone set", () => {
    beforeEach(async () => {
      msg.message.author.id = "no_timezone_set";

      tz.restore();
      tz = sandbox.stub(tzStore, "getAsync").resolves(null);

      await subject(msg, reminder);
    });

    it("messages timezone_not_set error", () =>
      expect(say.calledWith(exceptions.timezone_not_set)).to.be.true);

    afterEach(() => {
      msg.message.author.id = "123456789";
    });
  });

  context("user has a timezone set", () => {
    context("user inputs datetime in the past", () => {
      beforeEach(async () => {
        reminder.datetime = "five minutes ago";

        parseDate.delayAmt = 0;

        await subject(msg, reminder);
      });

      it("messages past_time error", () =>
        expect(say.calledWith(exceptions.past_time)).to.be.true);

      afterEach(() => {
        reminder.datetime = "in 1 hour";
        parseDate.delayAmt = 600;
      });
    });

    context("user inputs invalid datetime format", () => {
      beforeEach(async () => {
        reminder.datetime = "1 hour";
      });

      it("throws invalid_timezone error", () =>
        subject(msg, reminder).catch(error => {
          expect(error).to.eq(exceptions.invalid_timezone);
        }));

      afterEach(() => {
        reminder.datetime = "in 1 hour";
      });
    });

    context("when user inputs valid reminder", () => {
      let oldReminders;
      let newReminder;
      let res;
      let setReminders;

      const processValidReminder = async (oldReminders, newReminder) => {
        reminders.restore();
        sandbox.stub(reminderStore, "getAsync").resolves(oldReminders);

        setReminders = sandbox.stub(reminderStore, "setAsync");

        let allReminders = JSON.parse(oldReminders);
        allReminders.push(newReminder);

        res = [parseDate.timeInMS, JSON.stringify(allReminders)];

        await subject(msg, reminder);
      };

      context("reminders do not exists", () => {
        const oldReminders = JSON.stringify([]);

        const newReminder = {
          target: reminder.target.id,
          parsedTime: parseDate.parsed,
          content: reminder.content
        };

        beforeEach(async () => processValidReminder(oldReminders, newReminder));

        it("passes the reminder to the store", () =>
          expect(setReminders.calledWith(...res)).to.be.true);

        it("sends a direct message", () =>
          expect(
            dm.calledWith(
              `${parseDate.parsed}, ${reminder.target} ` +
                `will be reminded "${reminder.content}"`
            )
          ).to.be.true);
      });

      context("reminders exists", () => {
        const oldReminders = JSON.stringify([
          {
            target: 2112,
            parsedTime: 9001,
            content: "hi"
          }
        ]);

        const newReminder = {
          target: reminder.target.id,
          parsedTime: parseDate.parsed,
          content: reminder.content
        };

        beforeEach(async () => processValidReminder(oldReminders, newReminder));

        it("passes the reminder to the store", () =>
          expect(setReminders.calledWith(...res)).to.be.true);

        it("sends a direct message", () =>
          expect(
            dm.calledWith(
              `${parseDate.parsed}, ${reminder.target} ` +
                `will be reminded "${reminder.content}"`
            )
          ).to.be.true);
      });
    });
  });
});
