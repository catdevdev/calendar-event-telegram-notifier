import { getWeekNumber, isTimeBetween } from "./helpers";
import moment from "moment-timezone";
import _ from "lodash";
import { sendLessonNotification, sendMessage } from "./telegram";

import { ScheduleItem, fetchAndParseSchedule } from "./parseGoogleSheets";
import { Telegraf, session } from "telegraf";
import { PrismaClient, Schedule } from "@prisma/client";
import PublicGoogleSheetsParser from "public-google-sheets-parser";

export const bot = new Telegraf(
  "6484523697:AAEdJghBCZ5KOByrLn1MN2ZcxpXm-PXLhpg"
); // prod
// export const bot = new Telegraf(
//   "6431531399:AAGaexRfxQZTTs6We_nqtAnVdTvyxY7cNpI"
// ); // test
//

const notifiedEvents: string[] = [];

const checkSchedule = (schedules: Schedule[]) => {
  const currentTime = moment().tz("Europe/Kiev").format("HH:mm");
  const currentDayOfWeek = moment().day();

  const getCurrentWeekName = () => {
    switch (currentDayOfWeek) {
      case 1:
        return "Понедельник";
      case 2:
        return "Вторник";
      case 3:
        return "Среда";
      case 4:
        return "Четверг";
      case 5:
        return "Пятница";
      case 6:
        return "Суббота";
      case 7:
        return "Воскресенье";
    }
  };

  console.log(
    `  getWeekNumber({
      startEducationDate: "04.09.2023",
    })  `
  );
  console.log(
    getWeekNumber({
      startEducationDate: "04.09.2023",
    })
  );

  schedules.forEach((schedule) => {
    for (const item of schedule.googleTableContent as unknown as Schedule[]) {
      const splitTime = item?.["Время ⏰"]
        ? item?.["Время ⏰"]?.split(" - ")
        : [null, null];

      const splitWeeksNumbers = item?.["Недели ☀️"]
        ? item?.["Недели ☀️"]?.split(" - ")
        : [null, null];

      if (
        item["Время ⏰"] &&
        item["День недели 🌞"] &&
        item["Название предмета 📖"] &&
        item["Недели ☀️"] &&
        item["День недели 🌞"].includes(getCurrentWeekName()) &&
        splitTime?.[0] &&
        splitTime?.[1] &&
        splitWeeksNumbers?.[0] &&
        splitWeeksNumbers?.[1] &&
        schedule.googleTableContent[0]["Начало обучения"]
      ) {
        const fromMoment = moment(splitTime[0], "HH:mm");
        const fromMomentMinus10Min = fromMoment
          .subtract(10, "minutes")
          .toDate();

        const toMoment = moment(splitTime[1], "HH:mm").toDate();
        const currentTimeMoment = moment(currentTime, "HH:mm").toDate();

        if (
          isTimeBetween(fromMomentMinus10Min, toMoment, currentTimeMoment) &&
          +splitWeeksNumbers?.[0] <=
            getWeekNumber({
              startEducationDate:
                schedule.googleTableContent[0]["Начало обучения"],
            }) &&
          +splitWeeksNumbers?.[1] >=
            getWeekNumber({
              startEducationDate:
                schedule.googleTableContent[0]["Начало обучения"],
            })
        ) {
          if (
            !notifiedEvents.includes(
              item["Название предмета 📖"] +
                item["Недели ☀️"] +
                item["Время ⏰"] +
                schedule.telegramChatId
            )
          ) {
            const [startTime, endTime] = item["Время ⏰"].split(" - ");
            const [startWeek, endWeek] = item["Недели ☀️"].split(" - ");

            sendLessonNotification({
              lessonName: item["Название предмета 📖"],
              from: startTime,
              to: endTime,
              zoomLink: item["Ссылка на пару 🖇️"],
              telegramGroupLink: item["Ссылка на телеграм группу ☎️"],
              weekNumber: getWeekNumber({
                startEducationDate:
                  schedule.googleTableContent[0]["Начало обучения"],
              }),
              teacherEmail: item["Имеил препода 📧"],
              rangeWeekFrom: +startWeek,
              rangeWeekTo: +endWeek,
              telegramChatId: schedule.telegramChatId,
              googleTablePublicLink: schedule.googleTablePublicLink,
            });

            notifiedEvents.push(
              item["Название предмета 📖"] +
                item["Недели ☀️"] +
                item["Время ⏰"] +
                schedule.telegramChatId
            );
          }
        } else {
          _.remove(
            notifiedEvents,
            (lessonId) =>
              lessonId ===
              item["Название предмета 📖"] +
                item["Недели ☀️"] +
                item["Время ⏰"] +
                schedule.telegramChatId
          );
        }
      }
    }
  });
};

bot.start((ctx) => {
  ctx.reply(
    "Для регестрации расписания нужно ввести команду /register_schedule <публичная ссылка на гугл таблицу>.",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "пример заполненной google таблицы",
              url: "https://docs.google.com/spreadsheets/d/19wIQf7PzfAjf4aJTnLfeyyzEHnpNJ-szlG9AyWlV5FA/edit?usp=sharing",
            },
          ],
        ],
      },
    }
  );
});

bot.command("register_schedule", async (ctx) => {
  const prisma = new PrismaClient();

  const regex =
    /https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const match = ctx.message.text.match(regex);

  const link = match?.[0];

  if (!link) {
    return await ctx.reply(
      "Введите ссылку после команды\n<b>/register_schedule &lt;публичная ссылка на гугл таблицу&gt;</b>",
      {
        parse_mode: "HTML",
      }
    );
  }

  const schedule = await prisma.schedule.findUnique({
    where: {
      telegramChatId: String(ctx.chat.id),
    },
  });

  if (!schedule) {
    const regexForGoogleSheetCode = /\/d\/([^\/]+)/;
    const matchForGoogleSheetCode = link.match(regexForGoogleSheetCode);

    const parser = new PublicGoogleSheetsParser(
      matchForGoogleSheetCode[1] as any
    );

    const scheduleTableContent = await fetchAndParseSchedule({ parser });
    await prisma.schedule.create({
      data: {
        telegramChatId: String(ctx.chat.id),
        googleTablePublicLink: link,
        googleTableContent: scheduleTableContent as any,
      },
    });
    await ctx.reply(
      "<b>Расписание зарегестрировано!</b>\n\n<em>/register_schedule &lt;публичная ссылка на гугл таблицу&gt;.</em> - поменять ссылку на расписание\n\n<em>/update_schedule</em> - обновить расписание после изменений в гугл таблице",
      {
        parse_mode: "HTML",
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "расписание",
                url: link,
              },
            ],
          ],
        },
      }
    );
  } else {
    await prisma.schedule.update({
      where: { telegramChatId: String(ctx.chat.id) },
      data: {
        googleTablePublicLink: link,
      },
    });

    const schedule = await prisma.schedule.findUnique({
      where: {
        telegramChatId: String(ctx.chat.id),
      },
    });

    const regexForLink = /\/d\/([^\/]+)/;
    const matchForLink = schedule.googleTablePublicLink.match(regexForLink);
    const parser = new PublicGoogleSheetsParser(matchForLink[1] as any);

    const scheduleTableContent = await fetchAndParseSchedule({ parser });
    await prisma.schedule.update({
      where: {
        telegramChatId: String(ctx.chat.id),
      },
      data: {
        googleTableContent: scheduleTableContent as any,
      },
    });

    await ctx.reply("<b>Ссылка на расписание обновлена!</b>", {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "расписание",
              url: schedule.googleTablePublicLink,
            },
          ],
        ],
      },
    });
  }
  main();
  prisma.$disconnect();
});

bot.command("update_schedule", async (ctx) => {
  const prisma = new PrismaClient();
  const schedule = await prisma.schedule.findUnique({
    where: {
      telegramChatId: String(ctx.chat.id),
    },
  });

  if (!schedule) {
    await ctx.reply(
      "<b>Сначало зарегестрируйте расписание!</b>\n\n<em>/register_schedule &lt;публичная ссылка на гугл таблицу&gt;</em>",
      {
        parse_mode: "HTML",
      }
    );
  } else {
    const regex = /\/d\/([^\/]+)/;
    const match = schedule.googleTablePublicLink.match(regex);

    const spreadsheetId = match[1];

    const parser = new PublicGoogleSheetsParser(spreadsheetId);

    const scheduleTableContent = await fetchAndParseSchedule({ parser });

    const updateSchedule = await prisma.schedule.update({
      where: {
        telegramChatId: String(ctx.chat.id),
      },
      data: {
        googleTableContent: scheduleTableContent as any,
      },
    });
    await ctx.reply("<b>Расписание обновлено!</b>", {
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "расписание",
              url: updateSchedule.googleTablePublicLink,
            },
          ],
        ],
      },
    });

    main();
  }

  prisma.$disconnect();
});

let intervalId: NodeJS.Timeout;

const main = async () => {
  const prisma = new PrismaClient();
  const schedules = await prisma.schedule.findMany();

  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    checkSchedule(schedules);
  }, 5000);
};

main();

bot.launch();
