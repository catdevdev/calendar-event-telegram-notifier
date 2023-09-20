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

const notifiedEvents: string[] = [];

const schedules = [] as Schedule[];

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
    }
  };

  console.log("+++");

  schedules.forEach((schedule) => {
    for (const item of schedule.googleTableContent as any) {
      if (item["День недели 🌞"].includes(getCurrentWeekName())) {
        const [startTime, endTime] = item["Время ⏰"]?.split(" - ") || [];

        const fromMoment = moment(startTime, "HH:mm");
        const fromMomentMinus10Min = fromMoment
          .subtract(10, "minutes")
          .toDate();

        const toMoment = moment(endTime, "HH:mm").toDate();
        const currentTimeMoment = moment(currentTime, "HH:mm").toDate();

        console.log(item["Время ⏰"]);
        console.log(item["Недели ☀️"]);

        if (
          isTimeBetween(fromMomentMinus10Min, toMoment, currentTimeMoment) &&
          item["Время ⏰"] &&
          item["Недели ☀️"]
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

            // console.log(item["Недели ☀️"]);

            console.log("error");

            sendLessonNotification({
              lessonName: item["Название предмета 📖"],
              from: startTime,
              to: endTime,
              zoomLink: item["Ссылка на пару 🖇️"],
              telegramGroupLink: item["Ссылка на телеграм группу ☎️"],
              weekNumber: getWeekNumber(),
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

// sendMessage(
//   `Deployed`,
//   "https://gitlab.com/weather8855635/calendar-event-telegram-notifier/-/pipelines",
//   "-1001800810778"
// );

// sendLessonNotification({
//   lessonName: `lesson name test`,
//   from: "10:22",
//   to: "10:30",
//   zoomLink:
//     "https://www.google.com/search?q=await+inside+module&oq=await+inside+module&aqs=chrome..69i57.9402j0j7&sourceid=chrome&ie=UTF-8",
//   telegramGroupLink:
//     "https://stackoverflow.com/questions/11704267/in-javascript-how-to-conditionally-add-a-member-to-an-object",
//   weekNumber: getWeekNumber(),
//   teacherEmail: "catprogrammer.vlad@gmail.com",
//   rangeWeekFrom: 3,
//   rangeWeekTo: 5,
// });

// console.log(__dirname);
// bot.telegram.sendDocument("-1001800810778", "../s.xls");

// bot.command("s", () => {
//   bot.telegram.sendDocument(
//     "-1001800810778",
//     "https://dropmefiles.top/ua/g/1694610836/3cab6b8b2708f469275039d7ad17380c/176b0118b7aacf356577c92606d105f9"
//   );
// });

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
    main();
  }

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
    console.log("test");
    checkSchedule(schedules);
  }, 5000);
  console.log("intervalId");
  console.log(intervalId);
};

main();

bot.launch();
