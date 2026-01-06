// command to run local preview
// npx http-server /Users/aaron/Documents/javascript/room_reservations/room_reservations.html -o -p 9999

// get time of day in 15 min increments to get timeslot
function getTime() {
  let time = "";
  const now = new Date();
  let hour = now.getHours();
  let mins = now.getMinutes();
  let newMins = 0;
  let am = true;

  if (hour > 12) {
    hour = hour - 12;
    am = false;
  }

  if (mins < 15) {
    newMins = 0;
  } else if (mins < 30) {
    newMins = 15;
  } else if (mins < 45) {
    newMins = 30;
  } else {
    newMins = 45;
  }

  if (am) {
    time = hour + ":" + newMins + " AM";
  } else {
    time = hour + ":" + newMins + " PM";
  }

  return time;
}

console.log(getTime());
