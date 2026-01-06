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

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId,
    includeGridData: true,
  });

  const subSheets = spreadsheet.data.sheets.slice(0, -1); // leave off Stats sheet

  const sheetByRoomByTime = {};
  subSheets.forEach(function (sheet) {
    const sheetTitle = sheet.properties.title;
    const rows = sheet.data?.[0]?.rowData || [];
    let values = rows.map((row) => {
      const cells = row.values || [];
      return cells.map((cell) => cell.formattedValue || "");
    });
    values = values.slice(3, 67);

    const sheetByTime = {};
    for (const row of values) {
      const key = row[0];
      sheetByTime[key] = row.slice(1);
    }

    sheetByRoomByTime[sheetTitle] = sheetByTime;
  });

  return sheetByRoomByTime;
}

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

// Gets day of week, Monday 0, Sunday 6
function getAdjDay() {
  let dateObj = new Date();
  dayIdx = dateObj.getDay();
  if (dayIdx == 0) {
    dayIdx = 6;
  } else {
    dayIdx -= 1;
  }
  return dayIdx;
}

function buildTable(data, week) {
  const table = document.getElementById("weekTable" + week);
  const thead = table.querySelector("thead");
  const tbody = table.querySelector("tbody");

  // Clear table
  thead.innerHTML = "";
  tbody.innerHTML = "";

  // Get all unique time slots from first room
  const firstRoom = Object.keys(data)[0];
  const timeSlots = Object.keys(data[firstRoom]);

  // Build header row
  const headerRow = document.createElement("tr");
  headerRow.appendChild(document.createElement("th")); // empty corner
  timeSlots.forEach((slot) => {
    const th = document.createElement("th");
    th.textContent = slot;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Build rows for each room
  for (const [room, times] of Object.entries(data)) {
    const tr = document.createElement("tr");
    const tdRoom = document.createElement("td");
    tdRoom.textContent = room;
    tr.appendChild(tdRoom);

    timeSlots.forEach((slot) => {
      const td = document.createElement("td");
      td.textContent = times[slot] || ""; // empty if no reservation
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  }
}

async function main() {
  const currTime = getTime();
  const data = await readSheet();
  buildTable(data, 1);
  buildTable(data, 2);
  console.log(currTime);
  console.log(data);
}

main();
// const timeHeading = document.querySelector("#curr_time");
// timeHeading.textContent = "Practice Rooms Available for " + getTime() + ":";
