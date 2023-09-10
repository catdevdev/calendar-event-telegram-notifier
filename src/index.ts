import ical from "node-ical";
import { icsString } from "./ics";
const directEvents = ical.sync.parseICS(icsString);
import moment from "moment";
import { Telegraf } from "telegraf";
import { isTimeBetween } from "./helpers";

const bot = new Telegraf("6484523697:AAEdJghBCZ5KOByrLn1MN2ZcxpXm-PXLhpg");
const eventNotifications = new Map<string, boolean>();

const sendMessage = (chatId: string, message: string, buttonLink: string) => {
  bot.telegram
    .sendMessage(chatId, message, {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Lesson link",
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
        eventStart.setMinutes(eventStart.getMinutes() - 2);
        const eventEnd = new Date(event.end);

        const formattedFrom = moment(new Date(event.start)).format("HH:mm");
        const formattedTo = moment(eventEnd).format("HH:mm");

        if (
          isTimeBetween(eventStart, eventEnd, new Date()) &&
          moment().format("dddd") ===
            moment(new Date(event.start)).format("dddd")
        ) {
          if (!eventNotifications.has(event.summary)) {
            sendMessage(
              "-1001800810778",
              `<b>${event.summary}</b>\n\n<em>${formattedFrom} - ${formattedTo}</em>`,
              event.description
            );

            eventNotifications.set(event.summary, true);
          }
        } else {
          if (eventNotifications.has(event.summary)) {
            eventNotifications.delete(event.summary);
          }
        }
      }
    }
  }
};

sendMessage(
  "-1001800810778",
  `123123`,
  "https://gitlab.com/weather8855635/calendar-event-telegram-notifier/-/pipelines"
);

console.log(moment(new Date()));
console.log(moment().format("dd"));

setInterval(checkEvents, 10000);

bot.launch();
