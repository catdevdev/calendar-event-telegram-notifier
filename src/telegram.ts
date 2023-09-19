import { Telegraf } from "telegraf";

const bot = new Telegraf("6484523697:AAEdJghBCZ5KOByrLn1MN2ZcxpXm-PXLhpg");

export const sendMessage = (
  message: string,
  buttonLink: string,
  chatId: string = "-1001810089811"
) => {
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

const sendLessonNotification = ({
  lessonName,
  from,
  to,
  zoomLink,
  telegramGroupLink,
  weekNumber,
  teacherEmail,
  rangeWeekFrom,
  rangeWeekTo,
}: {
  lessonName: string;
  from: string;
  to: string;
  zoomLink?: string;
  telegramGroupLink?: string;
  weekNumber: number;
  teacherEmail?: string;
  rangeWeekFrom: number;
  rangeWeekTo: number;
}) => {
  const isEven = weekNumber % 2 === 0;

  const message = `<b>${lessonName}</b> (${rangeWeekFrom}-${rangeWeekTo})\n\n<em>⏰${from} - ${to} 10 мин до начала </em>\n☀️неделя ﹟${weekNumber} (${
    isEven ? "чётная" : "нечётная"
  })\n\n${teacherEmail ? `почта препода: ${teacherEmail}` : ""} `;

  // -1001810089811
  // -1001800810778
  bot.telegram.sendMessage("-1001810089811", message, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [
          ...(zoomLink && zoomLink !== "-"
            ? [{ text: "пара", url: zoomLink }]
            : []),
          ...(telegramGroupLink && telegramGroupLink !== "-"
            ? [{ text: "группа", url: telegramGroupLink }]
            : []),
          {
            text: "расписание",
            url: "https://docs.google.com/spreadsheets/d/19wIQf7PzfAjf4aJTnLfeyyzEHnpNJ-szlG9AyWlV5FA/edit?usp=sharing",
          },
        ],
      ],
    },
  });
};

bot.launch();

export { sendLessonNotification };
