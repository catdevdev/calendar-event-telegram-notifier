import moment from "moment";

export function isTimeBetween(
  eventStart: Date,
  eventEnd: Date,
  currentTime: Date
) {
  const startHours = eventStart.getUTCHours();
  const startMinutes = eventStart.getUTCMinutes();
  const startSeconds = eventStart.getUTCSeconds();
  const endHours = eventEnd.getUTCHours();
  const endMinutes = eventEnd.getUTCMinutes();
  const endSeconds = eventEnd.getUTCSeconds();
  const currentHours = currentTime.getUTCHours();
  const currentMinutes = currentTime.getUTCMinutes();
  const currentSeconds = currentTime.getUTCSeconds();

  const eventStartTime = startHours * 60 + startMinutes + startSeconds / 60;
  const eventEndTime = endHours * 60 + endMinutes + endSeconds / 60;
  const currentTimeValue =
    currentHours * 60 + currentMinutes + currentSeconds / 60;
  return currentTimeValue >= eventStartTime && currentTimeValue <= eventEndTime;
}

// Example usage
const eventStart = new Date("2023-09-04T11:48:00.000Z"); // Event starts at 11:48 AM EEST
const eventEnd = new Date("2023-09-04T15:10:00.000Z"); // Event ends at 03:10 PM EEST
const currentTime = new Date(); // Current time

const isBetween = isTimeBetween(eventStart, eventEnd, currentTime);

if (isBetween) {
  console.log("The current time is between the event start and end times.");
} else {
  console.log("The current time is not between the event start and end times.");
}

export const getWeekNumber = ({
  startEducationDate,
}: {
  startEducationDate: string;
}) => {
  const currentDate = moment();

  const startDate = moment(startEducationDate).format("DD.MM.YYYY");

  const weeksPassed = currentDate.diff(startDate, "weeks");

  return weeksPassed + 1;
};
