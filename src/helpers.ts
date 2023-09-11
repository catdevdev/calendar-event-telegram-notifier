import moment from "moment";

export function isTimeBetween(eventStart, eventEnd, currentTime) {
  const startHours = eventStart.getUTCHours();
  const startMinutes = eventStart.getUTCMinutes();
  const endHours = eventEnd.getUTCHours();
  const endMinutes = eventEnd.getUTCMinutes();
  const currentHours = currentTime.getUTCHours();
  const currentMinutes = currentTime.getUTCMinutes();

  const eventStartTime = startHours * 60 + startMinutes;
  const eventEndTime = endHours * 60 + endMinutes;
  const currentTimeValue = currentHours * 60 + currentMinutes;

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
