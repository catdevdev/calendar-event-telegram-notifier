import PublicGoogleSheetsParser from "public-google-sheets-parser";

const spreadsheetId = "19wIQf7PzfAjf4aJTnLfeyyzEHnpNJ-szlG9AyWlV5FA";

const parser = new PublicGoogleSheetsParser(spreadsheetId);

export interface ScheduleItem {
  "День недели 🌞"?: string;
  "Время ⏰"?: string;
  "Название предмета 📖"?: string;
  "Недели ☀️"?: string;
  "Ссылка на пару 🖇️"?: string;
  "Ссылка на телеграм группу ☎️"?: string;
  "Имеил препода 📧"?: string;
}

const fetchAndParseSchedule = async (): Promise<ScheduleItem[]> => {
  const schedule = await parser.parse();
  let currentDay = null;

  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i]["День недели 🌞"]) {
      currentDay = schedule[i]["День недели 🌞"];
    } else {
      schedule[i]["День недели 🌞"] = currentDay;
    }
  }

  for (let i = 0; i < schedule.length; i++) {
    if (schedule[i]["Время ⏰"]) {
      currentDay = schedule[i]["Время ⏰"];
    } else {
      schedule[i]["Время ⏰"] = currentDay;
    }
  }

  return schedule as ScheduleItem[];
};

fetchAndParseSchedule();

export { fetchAndParseSchedule };

// https://docs.google.com/spreadsheets/d/19wIQf7PzfAjf4aJTnLfeyyzEHnpNJ-szlG9AyWlV5FA/edit?usp=sharing
