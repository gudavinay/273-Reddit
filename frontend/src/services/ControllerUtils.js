const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC"
];

export function getUserProfile() {
  const data = JSON.parse(localStorage.getItem("userData"));
  if (data != null) return data;
}

export function getToken() {
  const data = JSON.parse(localStorage.getItem("userData"));
  if (data != null) return data.token;
}

export function getMongoUserID() {
  const data = JSON.parse(localStorage.getItem("userData"));
  if (data != null) return data._id; // to be impl
}

export function getSQLUserID() {
  const data = JSON.parse(localStorage.getItem("userData"));
  if (data != null) return data.userIDSQL; // to be impl
}

export function SetLocalStorage(data) {
  if (typeof Storage !== "undefined") {
    localStorage.clear();
    localStorage.setItem("userData", JSON.stringify(data));
  }
}

export function getMonthFromUtils(date) {
  let localDate = new Date(
    new Date(date).setHours(new Date(date).getHours() - 7)
  );
  return months[localDate.getMonth()];
}

export function getDateFromUtils(date) {
  let localDate = new Date(
    new Date(date).setHours(new Date(date).getHours() - 7)
  );
  return localDate.getDate();
}

export function getRelativeTime(date) {
  if (!date) {
    return null;
  }
  var now = new Date();
  var diff = parseInt((now.getTime() - Date.parse(date)) / 1000);
  if (diff < 60) {
    return "a few seconds ago";
  } else if (diff < 120) {
    return "about a minute ago";
  } else if (diff < 2700) {
    return parseInt(diff / 60).toString() + " minutes ago";
  } else if (diff < 5400) {
    return "about an hour ago";
  } else if (diff < 86400) {
    return "about " + parseInt(diff / 3600).toString() + " hours ago";
  } else if (diff < 172800) {
    return "1 day ago";
  } else {
    return parseInt(diff / 86400).toString() + " days ago";
  }
}

export function nFormatter(num, digits) {
  const si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  let i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}
