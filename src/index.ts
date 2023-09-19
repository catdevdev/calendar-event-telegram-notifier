import { getWeekNumber, isTimeBetween } from "./helpers";
import moment from "moment-timezone";
import _ from "lodash";
import { sendLessonNotification, sendMessage } from "./telegram";

import { ScheduleItem, fetchAndParseSchedule } from "./parseGoogleSheets";

const notifiedEvents: string[] = [];

const checkSchedule = (schedule: ScheduleItem[]) => {
  const currentTime = moment().tz("Europe/Kiev").format("HH:mm");

  const currentDayOfWeek = moment().day();

  console.log(currentDayOfWeek);

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

  for (const item of schedule) {
    if (item["День недели 🌞"].includes(getCurrentWeekName())) {
      const [startTime, endTime] = item["Время ⏰"]?.split(" - ") || [];

      const fromMoment = moment(startTime, "HH:mm");
      const fromMomentMinus10Min = fromMoment.subtract(10, "minutes").toDate();
      const toMoment = moment(endTime, "HH:mm").toDate();
      const currentTimeMoment = moment(currentTime, "HH:mm").toDate();

      if (isTimeBetween(fromMomentMinus10Min, toMoment, currentTimeMoment)) {
        if (
          !notifiedEvents.includes(
            item["Название предмета 📖"] + item["Недели ☀️"]
          )
        ) {
          const [startTime, endTime] = item["Время ⏰"].split(" - ");
          const [startWeek, endWeek] = item["Недели ☀️"].split(" - ");

          console.log(item["Название предмета 📖"]);

          console.log(item["Ссылка на телеграм группу ☎️"]);

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
          });

          notifiedEvents.push(item["Название предмета 📖"] + item["Недели ☀️"]);
        }
      } else {
        _.remove(
          notifiedEvents,
          (lessonId) =>
            lessonId === item["Название предмета 📖"] + item["Недели ☀️"]
        );
      }
    }
  }
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

const main = async () => {
  const schedule = await fetchAndParseSchedule();

  setInterval(() => checkSchedule(schedule), 5000);

  return schedule;
};

main();
