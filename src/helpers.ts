import moment from "moment";

export const isTimeBetween = (
  aStartTime: Date,
  anEndTime: Date,
  aCurrTime: Date
) => {
  // you may pass in aCurrTime or use the *actual* current time
  var currentTime = !aCurrTime ? moment() : moment(aCurrTime, "HH:mm a");
  var startTime = moment(aStartTime, "HH:mm a");
  var endTime = moment(anEndTime, "HH:mm a");

  if (startTime.hour() >= 12 && endTime.hour() <= 12) {
    endTime.add(1, "days"); // handle spanning days
  }

  var isBetween = currentTime.isBetween(startTime, endTime);

  /***  testing   
    startTimeString = startTime.toString();
    endTimeString = endTime.toString();
    currentTimeString = currentTime.toString();

    console.log(startTimeString);
    console.log(endTimeString);
    console.log(currentTimeString);
    console.log('\nis '+ currentTimeString  + ' between ' + 
              startTimeString + ' and ' + endTimeString + ' : ' 
              + isBetween);
    ****/
  return isBetween;
};
