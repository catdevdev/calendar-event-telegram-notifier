import ical from "node-ical";
import { icsString } from "./ics";
const directEvents = ical.sync.parseICS(icsString);
import { Telegraf } from "telegraf";
import { isTimeBetween } from "./helpers";
import moment from "moment-timezone";
import _ from "lodash";

const bot = new Telegraf("6484523697:AAEdJghBCZ5KOByrLn1MN2ZcxpXm-PXLhpg");
// const eventNotifications = new Map<string, boolean>();

const eventNotifications: string[] = [];

console.log("process.cwd()");
console.log(process.cwd());

const sendMessage = (chatId: string, message: string, buttonLink: string) => {
  bot.telegram
    .sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "пара",
              url: buttonLink,
            },
          ],
        ],
      },
    })
    .then(() => {
      console.log(`Message sent successfully to ${chatId}`);
    })
    .catch((error) => {
      console.error(error);
    });
};

const checkEvents = () => {
  for (let k in directEvents) {
    if (directEvents.hasOwnProperty(k)) {
      const event = directEvents[k] as unknown as {
        start: string;
        end: string;
        summary: string;
        description?: string;
      };

      if (directEvents[k].type == "VEVENT") {
        const eventStart = new Date(event.start);
        eventStart.setMinutes(eventStart.getMinutes() - 8);
        const eventEnd = new Date(event.end);

        const formattedFrom = moment(event.start)
          .tz("Europe/Kiev")
          .format("HH:mm");
        const formattedTo = moment(eventEnd).tz("Europe/Kiev").format("HH:mm");

        if (
          isTimeBetween(eventStart, eventEnd, new Date()) &&
          moment().format("dddd") ===
            moment(new Date(event.start)).format("dddd")
        ) {
          console.log(event.summary);
          console.log(event.description);
          if (!_.includes(eventNotifications, event.summary)) {
            sendMessage(
              // "-1001810089811",
              "-1001800810778",
              `<b>${event.summary}</b>\n\n<em>${formattedFrom} - ${formattedTo} ⏰</em>`,
              event.description
            );

            eventNotifications.push(event.summary);
          }
        } else {
          _.remove(eventNotifications, (summary) => summary === event.summary);
        }
      }
    }
  }
};

// sendMessage(
//   "-1001800810778",
//   `Deployed`,
//   "https://gitlab.com/weather8855635/calendar-event-telegram-notifier/-/pipelines"
// );

// console.log(__dirname);
// bot.telegram.sendDocument("-1001800810778", "../s.xls");

bot.command("s", () => {
  bot.telegram.sendDocument(
    "-1001800810778",
    "https://dropmefiles.com.ua/ua/VvewUQGEa"
  );
});

setInterval(checkEvents, 5000);

bot.launch();
