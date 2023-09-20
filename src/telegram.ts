import { Telegraf } from "telegraf";
import { bot } from ".";

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
  telegramChatId,
  googleTablePublicLink,
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
  telegramChatId: string;
  googleTablePublicLink: string;
}) => {
  const isEven = weekNumber % 2 === 0;

  const message = `<b>${lessonName}</b> (${rangeWeekFrom}-${rangeWeekTo})\n\n<em>⏰${from} - ${to} 10 мин до начала </em>\n☀️неделя ﹟${weekNumber} (${
    isEven ? "чётная" : "нечётная"
  })\n\n${teacherEmail ? `почта препода: ${teacherEmail}` : ""} `;

  // -1001810089811
  // -1001800810778

  try {
    bot.telegram.sendMessage(telegramChatId, message, {
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
              url: googleTablePublicLink,
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export { sendLessonNotification };
