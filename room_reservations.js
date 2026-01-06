// command to run local preview
// npx http-server /Users/aaron/Documents/javascript/room_reservations/room_reservations.html -o -p 9999

const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "credentials.json",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

async function readSheet() {
  const client = await auth.getClient();

  const sheets = google.sheets({
    version: "v4",
    auth: client,
  });

  const spreadsheetId = "13CdEbddbIDDHdCVU9IvpHQzSB4lJroJ36Riufl5uvTk";

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: "Studio (1)!A3:H67",
  });

  console.log(response.data.values);
}

readSheet();

// const timeHeading = document.querySelector("#curr_time");
// timeHeading.textContent = "Practice Rooms Available for " + getTime() + ":";

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
    newMins = "00";
  } else if (mins < 30) {
    newMins = "15";
  } else if (mins < 45) {
    newMins = "30";
  } else {
    newMins = "45";
  }

  if (am) {
    time = hour + ":" + newMins + " AM";
  } else {
    time = hour + ":" + newMins + " PM";
  }

  return time;
}
